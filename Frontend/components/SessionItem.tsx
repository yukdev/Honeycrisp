'use client';
import { useState } from 'react';
import { editItem } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { EatenBy, SessionItem } from '@/lib/types';

const SECONDS = 1000;

interface SessionItemProps {
  index: number;
  item: SessionItem;
  isOwner: boolean;
  userId: string;
  eatenBy: EatenBy[];
  isSelected: boolean;
  onItemClick: (itemId: string) => void;
}

function SessionItem({
  index,
  item,
  isOwner,
  userId,
  eatenBy,
  isSelected,
  onItemClick,
}: SessionItemProps) {
  const { id, name, price } = item;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editedName, setEditedName] = useState(name);
  const [editedPrice, setEditedPrice] = useState(price);

  const router = useRouter();

  const handleCheckboxChange = () => {
    onItemClick(id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedName(name);
    setEditedPrice(price);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPrice(Number(event.target.value));
  };

  const handleSubmitClick = async () => {
    setIsSubmitting(true);
    try {
      await editItem({
        id,
        name: editedName,
        price: editedPrice,
      });
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setTimeout(() => {
          setError('');
        }, 5 * SECONDS);
      }
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  return (
    <tr className="hover">
      <td>{index + 1}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={handleNameChange}
            className="input input-bordered input-sm input-warning w-32 max-w-xs text-center"
          />
        ) : (
          name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editedPrice}
            onChange={handlePriceChange}
            className="input input-bordered input-sm input-warning w-32 max-w-xs text-center"
          />
        ) : (
          price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
        )}
      </td>
      <td>
        <div className="flex flex-col items-center space-y-1">
          {eatenBy.map((eater) => (
            <div
              key={eater.id}
              className={`badge badge-sm ${
                userId === eater.id && 'badge-primary'
              }`}
            >
              {eater.name}
            </div>
          ))}
        </div>
      </td>
      <td>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={isSelected}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
      </td>
      {isOwner && (
        <td>
          {error && (
            <div className="toast">
              <div className="alert alert-error">
                <div>
                  <span>{error}</span>
                </div>
              </div>
            </div>
          )}
          {isEditing ? (
            <div className="btn-group">
              <button
                className={`btn btn-sm btn-primary ${
                  isSubmitting ? 'loading' : ''
                }`}
                onClick={handleSubmitClick}
              >
                {isSubmitting ? 'Submitting' : 'Submit'}
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleCancelClick}
              >
                X
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-warning"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </td>
      )}
    </tr>
  );
}

export default SessionItem;
