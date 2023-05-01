'use client';
import { v4 as uuid } from 'uuid';
import { guestLogin } from '@/lib/api';
import { Guest } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';

interface OwnerGuestsPanelProps {
  guests: Guest[];
  sessionId: string;
  selectedGuest: Guest | null;
  handleGuestSelect: (guest: Guest | null) => void;
}

const OwnerGuestsPanel = ({
  guests,
  sessionId,
  selectedGuest,
  handleGuestSelect,
}: OwnerGuestsPanelProps) => {
  const router = useRouter();
  const [showAddGuestForm, setshowAddGuestForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddGuestClick = () => {
    setshowAddGuestForm((prev) => !prev);
  };

  const handleGuestNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuestName(event.target.value);
  };

  const handleAddGuest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const guestEmail = `${uuid().slice(0, 8)}@guest.com`;
      const guestPassword = uuid().slice(0, 8);

      const newUser = await guestLogin({
        name: guestName,
        email: guestEmail,
        password: guestPassword,
        sessionId,
      });

      if (newUser) {
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
      handleAddGuestClick();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-2">
      {showAddGuestForm ? (
        <form onSubmit={(event) => handleAddGuest(event)} className="flex">
          <input
            type="text"
            placeholder="Enter guest name"
            onChange={handleGuestNameInput}
            className="input input-sm input-bordered input-secondary text-center max-w-xs mr-2"
          />
          <button
            type="submit"
            className={`btn btn-sm btn-secondary ${
              isSubmitting && 'loading'
            } flex-shrink-0`}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-error btn-outline ml-2 flex-shrink-0"
            onClick={handleAddGuestClick}
          >
            <FaTimes />
          </button>
        </form>
      ) : (
        <button
          className="btn btn-secondary btn-sm ml-2 flex-shrink-0"
          onClick={handleAddGuestClick}
        >
          Add Guest
        </button>
      )}
      {guests?.length > 0 && (
        <div className="flex flex-col items-center mt-3">
          <select
            id="guests-select"
            className="select select-secondary select-sm w-full max-w-xs text-center"
            value={selectedGuest?.id || ''}
            onChange={(e) => {
              const guestId = e.target.value;
              if (!guestId) {
                handleGuestSelect(null);
              } else {
                const guest = guests.find((g) => g.id === guestId);
                if (guest) {
                  handleGuestSelect(guest);
                }
              }
            }}
            style={{ appearance: 'none', paddingRight: '1.5rem' }}
          >
            <option value="">None</option>
            {guests.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default OwnerGuestsPanel;
