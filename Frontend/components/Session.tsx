'use client';
import { useState, useCallback } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
}

interface ItemEaten {
  itemId: string;
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
  const router = useRouter();
  const {
    user: { id: userId, name: userName },
  } = userSession;
  const { items, id: sessionId, itemsEaten } = session;

  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    const itemsEatenByUser = itemsEaten.filter((itemEaten) =>
      itemEaten.eatenBy.includes(userName),
    );
    return itemsEatenByUser.map((item) => item.itemId);
  });
  const [eatenItems, setEatenItems] = useState<string[]>([]);

  const handleItemClick = useCallback(
    (itemId: string) => {
      setSelectedItems((prevItems) => {
        if (prevItems.includes(itemId)) {
          return prevItems.filter((id) => id !== itemId);
        } else {
          return [...prevItems, itemId];
        }
      });
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
      console.log(
        '🚀 ~ file: Session.tsx:80 ~ handleSubmit ~ response:',
        response,
      );
      const newEatenItems = response.eatenItems;
      setEatenItems(newEatenItems);

      router.refresh();
    } catch (error) {
      console.log(error);
    }
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
              <th>Eaten By</th>
              <th>Ate?</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <SessionItem
                key={item.id}
                index={index}
                item={item}
                userName={userName}
                itemsEaten={itemsEaten}
                onItemClick={handleItemClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary my-3">
        Submit
      </button>
      {eatenItems.length > 0 && (
        <>
          <div className="toast">
            <div className="alert alert-success">
              <div>
                <span>Thanks for confirming what you ate!</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const revalidate = 60;

export default Session;
