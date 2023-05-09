'use client';
import { useState, useCallback, useEffect } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems, finalizeSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import OwnerGuestsPanel from './OwnerGuestsPanel';
import { DetailedSession, Guest, ItemEaten, userSession } from '@/lib/types';
const SECONDS = 1000;
interface SessionProps {
  session: DetailedSession;
  userSession: userSession;
}

const Session = ({ session, userSession }: SessionProps) => {
  const router = useRouter();
  const userId = userSession?.user?.id;
  const userName = userSession?.user?.name;
  const { items, id: sessionId, itemsEaten } = session;

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
      setIsConfirming(true);
      setConfirmError('');
      if (!selectedGuest) {
        await eatSessionItems({
          items: selectedItems,
          userId,
          userName,
          sessionId,
        });
      } else {
        await eatSessionItems({
          items: selectedItems,
          userId: selectedGuest.id,
          userName: selectedGuest.name,
          sessionId,
        });
      }
      router.refresh();
      setConfirmation('Thanks for confirming what you ate!');
      setTimeout(() => {
        setConfirmation('');
      }, 3 * SECONDS);
    } catch (error) {
      if (error instanceof Error) {
        setConfirmError(error.message);
      }
    } finally {
      setIsConfirming(false);
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
        <div className="mt-3 flex flex-col justify-center items-center">
          <button
            onClick={handleFinalize}
            className={`btn btn-accent btn-sm ${isFinalizing && 'loading'}`}
          >
            {isFinalizing ? 'Finalizing...' : 'Finalize'}
          </button>
          <div className="collapse collapse-arrow ml-2 mt-2 bg-base-200 rounded-box">
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
      <div className="w-full max-w-2xl text-center mt-1 mb-2">
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
            {items
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item, index) => {
                const { eatenBy } = itemsEaten.find(
                  (itemEaten) => itemEaten.itemId === item.id,
                ) as ItemEaten;

                const isSelected = selectedItems.includes(item.id);

                return (
                  <SessionItem
                    key={item.id}
                    index={index}
                    item={item}
                    userId={!selectedGuest ? userId : selectedGuest.id}
                    eatenBy={eatenBy}
                    onItemClick={handleItemClick}
                    isSelected={isSelected}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
      {confirmError && (
        <div className="alert alert-error shadow-lg mt-3">
          <div>
            <FaExclamationTriangle />
            <span>{confirmError}</span>
          </div>
        </div>
      )}
      <button
        onClick={handleSubmit}
        className={`btn btn-primary my-3 ${isConfirming && 'loading'}`}
      >
        {isConfirming ? 'Confirming...' : 'Confirm'}
      </button>
      {confirmation && (
        <div className="toast">
          <div className="alert alert-success">
            <div>
              <span>{confirmation}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const revalidate = 60;

export default Session;
