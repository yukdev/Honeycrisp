'use client';
import { useState, useCallback } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems } from '@/lib/api';

interface Item {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
}

interface ItemEaten {
  name: string;
  eatenBy: string[];
}

interface SessionProps {
  userSession: {
    user: {
      name: string;
      email: string;
      id: string;
      image?: any;
    };
  };
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
    items: Item[];
    itemsEaten: ItemEaten[];
  };
}

const Session = ({ session, userSession }: SessionProps) => {
  const {
    user: { id: userId, name: userName },
  } = userSession;
  const { items, id: sessionId } = session;

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

  const handleSubmit = async () => {
    try {
      const response = await eatSessionItems({
        items: selectedItems,
        userId,
        userName,
        sessionId,
      });
    } catch (error) {
      console.log(error);
    }
    console.log(selectedItems);
  };

  return (
    <div className="flex flex-col items-center justify-center container min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-accent">
          {session.name}
        </h1>
        <h1 className="text-xl font-bold mb-4 text-center text-secondary">{`Total: $${session.bill}`}</h1>
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
