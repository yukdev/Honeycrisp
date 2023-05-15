'use client';
import { useState, useCallback, useEffect } from 'react';
import SessionItem from './SessionItem';
import { eatSessionItems, finalizeSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import OwnerGuestsPanel from './OwnerGuestsPanel';
import {
  DetailedSession,
  Guest,
  ItemEaten,
  TipType,
  userSession,
} from '@/lib/types';
import Link from 'next/link';
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
  const [currentUserId, setCurrentUserId] = useState<string>(userId);
  const [potentialBill, setPotentialBill] = useState<number>(0);

  useEffect(() => {
    if (selectedGuest) {
      setCurrentUserId(selectedGuest.id);
    } else {
      setCurrentUserId(userId);
    }
  }, [selectedGuest, userId]);

  useEffect(() => {
    const itemsEatenByUser = itemsEaten.filter((itemEaten) =>
      itemEaten.eatenBy.some((user) => user.id === currentUserId),
    );

    const subtotal = itemsEatenByUser.reduce((acc, itemEaten) => {
      const item = items.find((item) => item.id === itemEaten.itemId);
      return item ? acc + item.price / itemEaten.eatenBy.length : acc;
    }, 0);

    const tax = subtotal * (session.tax / 100);
    const tip =
      session.tipType === TipType.PERCENTAGE
        ? subtotal * (session.tip / 100)
        : subtotal * (session.tip / session.subtotal);

    const total = subtotal + tax + tip;
    setPotentialBill(total);
  }, [currentUserId, items, itemsEaten, session]);

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
          <span>
            <Link
              href={`/sessions/${sessionId}/edit`}
              className="btn btn-warning btn-sm mr-2"
            >
              Edit
            </Link>
            <button
              onClick={handleFinalize}
              className={`btn btn-success btn-sm ${isFinalizing && 'loading'}`}
            >
              {isFinalizing ? 'Finalizing...' : 'Finalize'}
            </button>
          </span>
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
      {currentUserId !== session.ownerId && potentialBill !== 0 && (
        <div className="flex justify-center mt-1 text-2xl font-bold text-center">
          <h2 className="text-secondary mr-1">{`${
            selectedGuest
              ? `${selectedGuest.name} potentially owes:`
              : 'You potentially owe:'
          }`}</h2>
          <h2 className="text-accent underline">${potentialBill.toFixed(2)}</h2>
        </div>
      )}
      <div className="w-full max-w-2xl text-center mt-1 mb-2">
        <h2 className="text-2xl font-bold text-accent">Session Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-compact md:table-normal table-zebra w-full text-center">
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
      {userId && (
        <button
          onClick={handleSubmit}
          className={`btn btn-primary my-3 ${isConfirming && 'loading'}`}
        >
          {isConfirming ? 'Confirming...' : 'Confirm'}
        </button>
      )}
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
