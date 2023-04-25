'use client';
import { useState, useCallback } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems, finalizeSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { SessionProps } from '@/lib/types';

const Session = ({ session, userSession }: SessionProps) => {
  const router = useRouter();
  const userId = userSession?.user?.id;
  const userName = userSession?.user?.name;
  const { items, id: sessionId, itemsEaten } = session;

  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    const itemsEatenByUser = itemsEaten.filter((itemEaten) =>
      itemEaten.eatenBy.some((user) => user.id === userId),
    );
    return itemsEatenByUser.map((item) => item.itemId);
  });

  const [eatenItems, setEatenItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState('');
  const [submitError, setSubmitError] = useState('');

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
      if (error instanceof Error) {
        setSubmitError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (userId !== session.ownerId) {
      return;
    }
    try {
      setIsFinalizing(true);
      await finalizeSession(sessionId, userId);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setFinalizeError(error.message);
      }
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <>
      <section
        id="session-items"
        className="flex flex-col items-center flex-grow"
      >
        {finalizeError && (
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
              <span>{finalizeError}</span>
            </div>
          </div>
        )}
        {session.ownerId === userId && (
          <div className="my-3">
            <button
              onClick={handleFinalize}
              className={`btn btn-accent btn-sm ${isFinalizing && 'loading'}`}
            >
              {isFinalizing ? 'Finalizing...' : 'Finalize'}
            </button>
          </div>
        )}
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-accent">Session Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr>
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
                  userId={userId}
                  itemsEaten={itemsEaten}
                  onItemClick={handleItemClick}
                />
              ))}
            </tbody>
          </table>
        </div>
        {selectedItems.length === 0 && (
          <div className="mt-3">
            <p className="text-center text-red-500">
              Please select what you ate before submitting.
            </p>
          </div>
        )}
        {submitError && (
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
              <span>{submitError}</span>
            </div>
          </div>
        )}
        <button
          onClick={handleSubmit}
          className={`btn btn-primary mt-3 ${isSubmitting && 'loading'}`}
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
    </>
  );
};

export const revalidate = 60;

export default Session;
