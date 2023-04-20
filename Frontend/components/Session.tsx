'use client';
import { useState, useCallback } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems, finalizeSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { SessionProps } from '@/lib/types';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

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
      setIsSubmitting(true);
      const response = await eatSessionItems({
        items: selectedItems,
        userId,
        userName,
        sessionId,
      });
      const newEatenItems = response.eatenItems;
      setEatenItems(newEatenItems);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setIsFinalizing(true);
      await finalizeSession(sessionId, userId);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section id="session-info" className="w-full max-w-2xl my-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-accent">
          {session.name}
        </h1>
        <div className="flex justify-center items-center mb-3">
          <div className="flex flex-col items-center justify-center mx-8">
            <h2 className="text-lg font-bold mb-2 text-center text-secondary">
              Tip
            </h2>
            <p className="text-2xl font-bold text-center text-accent">{`${session.tip}%`}</p>
          </div>
          <div className="flex flex-col items-center justify-center mx-8">
            <h2 className="text-lg font-bold mb-2 text-center text-secondary">
              Tax
            </h2>
            <p className="text-2xl font-bold text-center text-accent">{`${session.tax}%`}</p>
          </div>
          <div className="flex flex-col items-center justify-center mx-8">
            <h2 className="text-lg font-bold mb-2 text-center text-secondary">
              Total
            </h2>
            <p className="text-2xl font-bold text-center underline text-accent">{`$${session.bill}`}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <h2 className="text-xl font-bold text-center text-base-content mr-6">
            {`Owner: ${
              session.ownerName === userName ? 'You' : session.ownerName
            }`}
          </h2>
          {session.ownerName === userName && (
            <button
              onClick={handleFinalize}
              className={`btn btn-accent btn-sm ${isFinalizing && 'loading'}`}
            >
              {isFinalizing ? 'Finalizing...' : 'Finalize'}
            </button>
          )}
        </div>
        {selectedItems.length === 0 && (
          <p className="text-center text-red-500 mb-4">
            Please select what you ate before submitting.
          </p>
        )}
      </section>
      <section
        id="session-items"
        className="flex flex-col justify-center items-center flex-grow"
      >
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-accent">Session Items</h2>
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
        <button
          onClick={handleSubmit}
          className={`btn btn-primary my-3 ${isSubmitting && 'loading'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {eatenItems.length > 0 && (
          <div className="toast">
            <div className="alert alert-success">
              <div>
                <span>Thanks for confirming what you ate!</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export const revalidate = 60;

export default Session;
