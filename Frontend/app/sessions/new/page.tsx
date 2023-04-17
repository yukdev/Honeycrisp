'use client';

import { useState } from 'react';

type SessionData = {
  name: string;
  tax: number;
  tip: number;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

const CreateSessionPage = () => {
  const [sessionData, setSessionData] = useState<SessionData>({
    name: '',
    tax: 8.875,
    tip: 18,
    items: [{ name: '', price: 0, quantity: 1 }],
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const handleItemChange = (
    index: number,
    field: keyof typeof sessionData.items[0],
    value: string | number,
  ) => {
    const newItems = [...sessionData.items];
    newItems[index][field] = value;
    setSessionData({ ...sessionData, items: newItems });
  };

  const addItem = () => {
    setSessionData({
      ...sessionData,
      items: [...sessionData.items, { name: '', price: 0, quantity: 1 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...sessionData.items];
    newItems.splice(index, 1);
    setSessionData({ ...sessionData, items: newItems });
  };

  const handleSubmit = () => {
    console.log(sessionData);
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
            className="input input-bordered input-primary w-full max-w-xs"
            type="text"
            name="name"
            value={sessionData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between">
          <div className="mb-4 mr-4">
            <label className="block font-bold mb-2 text-center" htmlFor="tax">
              Tax:
            </label>
            <input
              className="input input-bordered input-primary w-full max-w-xs"
              type="number"
              name="tax"
              value={sessionData.tax}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2 text-center" htmlFor="tip">
              Tip:
            </label>
            <input
              className="input input-bordered input-primary w-full max-w-xs"
              type="number"
              name="tip"
              value={sessionData.tip}
              onChange={handleInputChange}
            />
          </div>
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
                    className="input input-bordered input-primary w-full max-w-xs text-center"
                    type="text"
                    value={item.name}
                    onChange={(event) =>
                      handleItemChange(index, 'name', event.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-primary w-full max-w-xs text-center"
                    type="number"
                    value={item.price}
                    onChange={(event) =>
                      handleItemChange(index, 'price', event.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-primary w-full max-w-xs text-center"
                    type="number"
                    value={item.quantity}
                    onChange={(event) =>
                      handleItemChange(index, 'quantity', event.target.value)
                    }
                  />
                </td>
                <td>
                  {index > 0 && (
                    <button
                      className="btn btn-error btn-circle btn-outline"
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="btn btn-primary" onClick={addItem}>
            Add Item
          </button>
        </div>
      </div>
      <button className="btn btn-accent my-3" onClick={() => handleSubmit()}>
        Create Session
      </button>
    </div>
  );
};

export default CreateSessionPage;
