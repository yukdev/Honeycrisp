'use client';
import { createSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface SessionData {
  name: string;
  tax: number;
  tip: number;
  items: Item[];
}

const NewSessionForm = ({ userSession }: NewSessionFormProps) => {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionData>({
    name: '',
    tax: 8.875,
    tip: 20,
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
    field: keyof Item,
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
    try {
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

  return (
    <div className="flex flex-col items-center container min-h-screen mt-5">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Create a new session
        </h1>
      </div>
      <div className="flex justify-center flex-col">
        <div className="flex flex-col items-center mb-4">
          <label className="block font-bold mb-2 text-center" htmlFor="name">
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
        <div className="flex justify-between items-center">
          <label className="block font-bold text-center" htmlFor="tax">
            Tax:
          </label>
          <input
            className="input input-bordered input-sm input-primary w-24 text-center mx-2"
            type="number"
            name="tax"
            value={sessionData.tax}
            onChange={handleInputChange}
          />
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
        </div>
      </div>
      {/* table portion */}
      <div className="mt-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-center font-bold">#</th>
              <th className="text-center font-bold">Name</th>
              <th className="text-center font-bold">Price</th>
              <th className="text-center font-bold">Quantity</th>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
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
      <button className="btn btn-accent my-3" onClick={() => handleSubmit()}>
        Create Session
      </button>
      {error && (
        <div className="alert alert-error shadow-lg mt-3  ">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSessionForm;