'use client';
import { editSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import {
  TipType,
  DetailedSession,
  EditedSessionData,
  EditedItem,
} from '@/lib/types';
import { v4 as uuid } from 'uuid';

interface SessionEditFormProps {
  session: DetailedSession;
  userId: string;
}

const SessionEditForm = ({ session, userId }: SessionEditFormProps) => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<EditedSessionData>({
    name: session.name,
    tax: session.tax,
    tip: session.tip,
    tipType: session.tipType,
    items: session.items.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
  });
  const [runningTotal, setRunningTotal] = useState(session.bill);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const subtotal = sessionData.items.reduce(
      (acc, item) => acc + item.price,
      0,
    );
    const tax = sessionData.tax ? subtotal * (sessionData.tax / 100) : 0;
    const tip = sessionData.tip
      ? sessionData.tipType === TipType.PERCENTAGE
        ? subtotal * (sessionData.tip / 100)
        : sessionData.tip
      : 0;
    const total = subtotal + tax + tip;
    setRunningTotal(total);
  }, [sessionData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue =
      name === 'tax' || name === 'tip' ? parseFloat(value) : value;
    setSessionData({ ...sessionData, [name]: newValue });
  };

  const handleItemChange = (
    id: string,
    field: keyof EditedItem,
    value: string | number,
  ) => {
    const newItems = [...sessionData.items];
    const index = newItems.findIndex((item) => item.id === id);
    newItems[index][field] = value as never;
    setSessionData({ ...sessionData, items: newItems });
  };

  const handleAddItem = () => {
    setSessionData({
      ...sessionData,
      items: [...sessionData.items, { id: uuid(), name: '', price: 0 }],
    });
  };

  const handleRemoveItem = (id: string) => {
    if (sessionData.items.length === 1) {
      setSessionData({
        ...sessionData,
        items: [{ id: uuid(), name: '', price: 0 }],
      });
    } else {
      const newItems = sessionData.items.filter((item) => item.id !== id);
      setSessionData({ ...sessionData, items: newItems });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    try {
      await editSession(session.id, sessionData);
      router.push(`/sessions/${session.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): string => {
    let errorMessage = '';

    if (sessionData.name.trim() === '') {
      errorMessage = 'The session name cannot be blank.';
      return errorMessage;
    }

    if (isNaN(sessionData.tax) || sessionData.tax < 0) {
      errorMessage = 'The tax must be a valid number.';
      return errorMessage;
    }

    if (isNaN(sessionData.tip) || sessionData.tip < 0) {
      errorMessage = 'The tip must be a valid number.';
      return errorMessage;
    }

    const missingItemNames = sessionData.items.filter(
      (item) => item.name.trim() === '',
    );
    if (missingItemNames.length > 0) {
      errorMessage = 'Item names cannot be blank.';
      return errorMessage;
    }

    const invalidItemPrices = sessionData.items.filter(
      (item) => isNaN(item.price) || item.price <= 0,
    );
    if (invalidItemPrices.length > 0) {
      errorMessage = 'Item prices must be valid numbers.';
      return errorMessage;
    }

    return errorMessage;
  };

  const handleTipTypeChange = (type: TipType) => {
    setSessionData({ ...sessionData, tipType: type });
  };

  return (
    <div className="flex flex-col items-center container min-h-screen text-base-content mt-5">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-accent">
          Edit Session Details
        </h1>
      </div>
      <div id="session-info" className="flex justify-center flex-col">
        <div className="flex flex-col items-center mb-2">
          <label
            className="block font-bold text-center text-lg mb-1"
            htmlFor="name"
          >
            Session Name:
          </label>
          <input
            className="input input-bordered input-sm input-primary w-full max-w-xs text-center text-lg"
            type="text"
            name="name"
            value={sessionData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center mb-2">
            <label
              className="block font-bold text-center text-lg"
              htmlFor="tax"
            >
              Tax %:
            </label>
            <input
              className="input input-bordered input-sm input-primary w-24 text-center text-lg mx-2"
              type="number"
              name="tax"
              value={sessionData.tax}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-center items-center">
            <label
              className="block font-bold text-center text-lg"
              htmlFor="tip"
            >
              Tip:
            </label>
            <input
              className="input input-bordered input-sm input-primary w-24 text-center text-lg mx-2"
              type="number"
              name="tip"
              value={sessionData.tip}
              onChange={handleInputChange}
            />
            <div className="btn-group">
              <button
                className={`btn btn-sm ${
                  sessionData.tipType === TipType.PERCENTAGE && 'btn-primary'
                }`}
                onClick={() => handleTipTypeChange(TipType.PERCENTAGE)}
              >
                %
              </button>
              <button
                className={`btn btn-sm ${
                  sessionData.tipType === TipType.FLAT && 'btn-primary'
                }`}
                onClick={() => handleTipTypeChange(TipType.FLAT)}
              >
                Flat
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <table className="table table-compact md:table-normal table-zebra w-full">
          <thead>
            <tr>
              <th className="text-center font-bold">#</th>
              <th className="text-center font-bold">Name</th>
              <th className="text-center font-bold">Price</th>
              <th className="text-center font-bold">Eaten By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessionData.items.map((item, index) => {
              const eatenBy = session.itemsEaten.find(
                (itemEaten) => itemEaten.itemId === item.id,
              )?.eatenBy;

              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      className="input input-bordered input-xs md:input-sm input-primary w-full max-w-xs text-center text-md md:text-lg"
                      type="text"
                      value={item.name}
                      onChange={(event) =>
                        handleItemChange(item.id, 'name', event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input input-bordered input-xs md:input-sm input-primary w-full max-w-xs text-center text-md md:text-lg"
                      type="number"
                      value={item.price}
                      onChange={(event) =>
                        handleItemChange(
                          item.id,
                          'price',
                          Number(event.target.value),
                        )
                      }
                    />
                  </td>
                  <td>
                    <div className="flex flex-col items-center space-y-1">
                      {eatenBy?.map((eater) => (
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
                    <button
                      className="btn btn-error btn-circle btn-outline btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="btn btn-primary btn-sm" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-1 text-2xl font-bold text-center">
        <h2 className="text-secondary mr-1">Running total:</h2>
        <h2 className="text-accent underline">${runningTotal.toFixed(2)}</h2>
      </div>
      {error && (
        <div className="alert alert-error shadow-lg my-3">
          <div>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}
      <button
        className={`btn btn-accent my-3 ${isSubmitting && 'loading'}`}
        onClick={() => handleSubmit()}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Changes'}
      </button>
    </div>
  );
};

export default SessionEditForm;
