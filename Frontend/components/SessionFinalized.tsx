'use client';
import { useState } from 'react';
import { togglePaid, unfinalizeSession } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import { DetailedSession, Split, userSession } from '@/lib/types';

interface SessionFinalizedProps {
  session: DetailedSession;
  userSession: userSession;
}

const SessionFinalized = ({ session, userSession }: SessionFinalizedProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('split');
  const [split, setSplit] = useState<Split[]>(
    JSON.parse(JSON.stringify(session.split)),
  );
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [isUnfinalizing, setIsUnfinalizing] = useState(false);
  const [unfinalizeError, setUnfinalizeError] = useState('');

  const {
    user: { id: userId },
  } = userSession;

  const { id: sessionId } = session;

  const handlePaidChange = async (id: string) => {
    if (userId !== session.ownerId) {
      return;
    }
    if (userId == id) {
      return;
    }
    try {
      setProcessingUserId(id);
      const updatedSplit = split.map((user: Split) => {
        if (user.id === id) {
          return { ...user, paid: !user.paid };
        }
        return user;
      });
      await togglePaid(session.id, id);
      setSplit(updatedSplit);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleUnfinalize = async () => {
    try {
      setIsUnfinalizing(true);
      setUnfinalizeError('');
      await unfinalizeSession(sessionId, userId);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setUnfinalizeError(error.message);
      }
    } finally {
      setIsUnfinalizing(false);
    }
  };

  return (
    <section
      id="session-split-and-items"
      className="flex flex-col items-center flex-grow"
    >
      {unfinalizeError && (
        <div className="alert alert-error shadow-lg mt-3">
          <div>
            <FaExclamationTriangle />
            <span>{unfinalizeError}</span>
          </div>
        </div>
      )}
      {session.ownerId === userId && (
        <div className="my-3">
          <button
            onClick={handleUnfinalize}
            className={`btn btn-accent btn-sm ${isUnfinalizing && 'loading'}`}
          >
            {isUnfinalizing ? 'Unfinalizing...' : 'Unfinalize'}
          </button>
        </div>
      )}
      <div className="tabs">
        <a
          className={`tab tab-lg tab-lifted ${
            activeTab === 'split' ? 'tab-active font-bold' : ''
          }`}
          onClick={() => setActiveTab('split')}
        >
          Bill split
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            activeTab === 'items' ? 'tab-active font-bold' : ''
          }`}
          onClick={() => setActiveTab('items')}
        >
          Item split
        </a>
      </div>

      {activeTab === 'split' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Split</th>
                <th>Paid?</th>
              </tr>
            </thead>
            <tbody>
              {split.map(({ id, name, split, paid }, index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>
                    <div
                      className={`${
                        id == userId ? 'font-bold text-secondary' : ''
                      }`}
                    >
                      {name}
                    </div>
                  </td>
                  <td>${split.toFixed(2)}</td>
                  <td>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={paid}
                          onChange={() => handlePaidChange(id)}
                          disabled={processingUserId === id}
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'items' && (
        <div id="session-items">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Eaten By</th>
              </tr>
            </thead>
            <tbody>
              {session.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="flex flex-col items-center space-y-1">
                      {session.itemsEaten
                        .filter((itemEaten) => itemEaten.itemId === item.id)
                        .map((itemEaten) =>
                          itemEaten.eatenBy.map((user) => (
                            <div
                              key={itemEaten.itemId}
                              className={`badge badge-sm ${
                                user.id == userId && 'badge-primary'
                              }`}
                            >
                              {user.name}
                            </div>
                          )),
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default SessionFinalized;
