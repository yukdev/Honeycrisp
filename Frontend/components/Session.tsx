'use client';
import { useState, useCallback } from 'react';
import SessionItem from './SessionItem';

interface SessionProps {
  session: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    ownerName: string;
    finalized: boolean;
    bill: number | null;
    tax: number;
    tip: number;
    items: {
      id: string;
      name: string;
      price: number;
      createdAt: string;
      updatedAt: string;
      sessionId: string;
    }[];
  };
}

const Session = ({ session }: SessionProps) => {
  const { items } = session;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemClick = useCallback(
    (itemId: string) => {
      setSelectedItems((prevItems) =>
        prevItems.includes(itemId)
          ? prevItems.filter((id) => id !== itemId)
          : [...prevItems, itemId],
      );
    },
    [setSelectedItems],
  );

  const handleSubmit = () => {
    console.log(selectedItems);
  };

  return (
    <div className="flex flex-col items-center justify-center container min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">{session.name}</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-center">
              <th></th>
              <th>Item</th>
              <th>Price</th>
              <th>Ate?</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <SessionItem
                key={item.id}
                index={index}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onItemClick={handleItemClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary my-3">
        Submit
      </button>
    </div>
  );
};

export const revalidate = 60;

export default Session;
