'use client';
import { createSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { NewSessionData, TipType, NewItem } from '@/lib/types';

interface NewSessionFormProps {
  userSession: {
    user: {
      name: string;
      email: string;
      id: string;
      image?: any;
    };
  };
}

const NewSessionForm = ({ userSession }: NewSessionFormProps) => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<NewSessionData>({
    name: '',
    tax: 8.875,
    tip: 20,
    tipType: TipType.PERCENTAGE,
    items: [{ name: '', price: 0, quantity: 1 }],
  });
  const [error, setError] = useState('');

  const {
    user: { name: ownerName, id: ownerId },
  } = userSession;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue =
      name === 'tax' || name === 'tip' ? parseFloat(value) : value;
    setSessionData({ ...sessionData, [name]: newValue });
  };

  const handleItemChange = (
    index: number,
    field: keyof NewItem,
    value: string | number,
  ) => {
    const newItems = [...sessionData.items];
    newItems[index][field] = value as never;
    setSessionData({ ...sessionData, items: newItems });
  };

  const addItem = () => {
    setSessionData({
      ...sessionData,
      items: [...sessionData.items, { name: '', price: 0, quantity: 1 }],
    });
  };

  const removeItem = (index: number) => {
    if (sessionData.items.length === 1) {
      setSessionData({
        ...sessionData,
        items: [{ name: '', price: 0, quantity: 1 }],
      });
    } else {
      const newItems = [...sessionData.items];
      newItems.splice(index, 1);
      setSessionData({ ...sessionData, items: newItems });
    }
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setError('');
      const response = await createSession({
        ...sessionData,
        ownerName,
        ownerId,
      });

      const { id } = response;
      router.push(`/sessions/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const validateForm = (): string => {
    let errorMessage = '';

    if (sessionData.name.trim() === '') {
      errorMessage = 'Session name is required.';
      return errorMessage;
    }

    const missingItemNames = sessionData.items.filter(
      (item) => item.name.trim() === '',
    );
    if (missingItemNames.length > 0) {
      errorMessage = 'Item names are required for all items.';
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
    <div className="flex flex-col items-center container min-h-screen mt-5">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Create a new session
        </h1>
      </div>
      <div id="session-info" className="flex justify-center flex-col">
        <div className="flex flex-col items-center mb-2">
          <label className="block font-bold mb-1 text-center" htmlFor="name">
            Session Name:
          </label>
          <input
            className="input input-bordered input-sm input-primary w-full max-w-xs text-center"
            type="text"
            name="name"
            value={sessionData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center mb-2">
            <label className="block font-bold text-center" htmlFor="tax">
              Tax %:
            </label>
            <input
              className="input input-bordered input-sm input-primary w-24 text-center mx-2"
              type="number"
              name="tax"
              value={sessionData.tax}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-center items-center">
            <label className="block font-bold text-center" htmlFor="tip">
              Tip:
            </label>
            <input
              className="input input-bordered input-sm input-primary w-24 text-center mx-2"
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
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-center font-bold">#</th>
              <th className="text-center font-bold">Name</th>
              <th className="text-center font-bold">Price</th>
              <th className="text-center font-bold">Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessionData.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    className="input input-bordered input-sm input-primary w-full max-w-xs text-center"
                    type="text"
                    value={item.name}
                    onChange={(event) =>
                      handleItemChange(index, 'name', event.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm input-primary w-full max-w-xs text-center"
                    type="number"
                    value={item.price}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        'price',
                        Number(event.target.value),
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm input-primary w-full max-w-xs text-center"
                    type="number"
                    value={item.quantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        'quantity',
                        Number(event.target.value),
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-error btn-circle btn-outline btn-sm"
                    onClick={() => removeItem(index)}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="btn btn-primary btn-sm" onClick={addItem}>
            Add Item
          </button>
        </div>
      </div>
      {error && (
        <div className="alert alert-error shadow-lg my-3">
          <div>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}
      <button className="btn btn-accent my-3" onClick={() => handleSubmit()}>
        Create Session
      </button>
    </div>
  );
};

export default NewSessionForm;
