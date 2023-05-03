'use client';
import { useState, useCallback, useEffect } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems, finalizeSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import OwnerGuestsPanel from './OwnerGuestsPanel';
import { DetailedSession, Guest, userSession } from '@/lib/types';
interface SessionProps {
  session: DetailedSession;
  userSession: userSession;
}

const Session = ({ session, userSession }: SessionProps) => {
  const router = useRouter();
  const userId = userSession?.user?.id;
  const userName = userSession?.user?.name;
  const { items, id: sessionId, itemsEaten } = session;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [eatenItems, setEatenItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

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
      setSubmitError('');
      if (!selectedGuest) {
        const response = await eatSessionItems({
          items: selectedItems,
          userId,
          userName,
          sessionId,
        });
        const newEatenItems = response.eatenItems;
        setEatenItems(newEatenItems);
      } else {
        const response = await eatSessionItems({
          items: selectedItems,
          userId: selectedGuest.id,
          userName: selectedGuest.name,
          sessionId,
        });
        const newEatenItems = response.eatenItems;
        setEatenItems(newEatenItems);
      }
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
      setFinalizeError('');
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

  const handleGuestSelect = (guest: Guest | null) => {
    setSelectedGuest(guest);
  };

  useEffect(() => {
    if (!selectedGuest) {
      setSelectedItems(() => {
        const itemsEatenByUser = itemsEaten.filter((itemEaten) =>
          itemEaten.eatenBy.some((user) => user.id === userId),
        );
        return itemsEatenByUser.map((item) => item.itemId);
      });
    } else {
      setSelectedItems(() => {
        const itemsEatenbyGuest = itemsEaten.filter((itemEaten) =>
          itemEaten.eatenBy.some((user) => user.id === selectedGuest!.id),
        );
        return itemsEatenbyGuest.map((item) => item.itemId);
      });
    }
  }, [selectedGuest, itemsEaten, userId]);

  return (
    <section
      id="session-items"
      className="flex flex-col items-center flex-grow"
    >
      {finalizeError && (
        <div className="alert alert-error shadow-lg mt-3">
          <div>
            <FaExclamationTriangle />
            <span>{finalizeError}</span>
          </div>
        </div>
      )}
      {session.ownerId === userId && (
        <div className="my-3 flex flex-col justify-center items-center">
          <button
            onClick={handleFinalize}
            className={`btn btn-accent btn-sm ${isFinalizing && 'loading'}`}
          >
            {isFinalizing ? 'Finalizing...' : 'Finalize'}
          </button>
          <div className="collapse collapse-arrow ml-2">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium text-center">
              <p>Confirm on behalf of guests</p>
            </div>
            <div className="collapse-content">
              <OwnerGuestsPanel
                sessionId={sessionId}
                guests={session.guests}
                selectedGuest={selectedGuest}
                handleGuestSelect={handleGuestSelect}
              />
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl text-center mb-2">
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
              {session.ownerId === userId && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item, index) => (
                <SessionItem
                  key={item.id}
                  index={index}
                  item={item}
                  userId={!selectedGuest ? userId : selectedGuest.id}
                  itemsEaten={itemsEaten}
                  onItemClick={handleItemClick}
                  isOwner={session.ownerId === userId}
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
        <div className="alert alert-error shadow-lg mt-3">
          <div>
            <FaExclamationTriangle />
            <span>{submitError}</span>
          </div>
        </div>
      )}
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
  );
};

export const revalidate = 60;

export default Session;
