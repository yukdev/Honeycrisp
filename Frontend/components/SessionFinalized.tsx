'use client';
import { SessionProps } from '@/lib/types';
import { useState } from 'react';
import { togglePaid } from '@/lib/api';
interface UserSplit {
  id: string;
  name: string;
  split: number;
  paid: boolean;
}

const SessionFinalized = ({ session, userSession }: SessionProps) => {
  const [activeTab, setActiveTab] = useState('split');
  const [split, setSplit] = useState<UserSplit[]>(
    JSON.parse(JSON.stringify(session.split)),
  );
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  const {
    user: { name: userName, id: userId },
  } = userSession;

  const handlePaidChange = async (id: string) => {
    if (userId !== session.ownerId) {
      return;
    }
    if (userId == id) {
      return;
    }
    try {
      setProcessingUserId(id);
      const updatedSplit = split.map((user: UserSplit) => {
        if (user.id === id) {
          return { ...user, paid: !user.paid };
        }
        return user;
      });
      await togglePaid(session.id, id);
      setSplit(updatedSplit);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingUserId(null);
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
        </div>
      </section>
      <section
        id="session-split-and-items"
        className="flex flex-col items-center flex-grow"
      >
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
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
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
                          id == session.ownerId
                            ? 'font-bold text-secondary'
                            : ''
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
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
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
                      {session.itemsEaten
                        .filter((itemEaten) => itemEaten.itemId === item.id)
                        .map((itemEaten) =>
                          itemEaten.eatenBy.map((user) => (
                            <li
                              key={itemEaten.itemId}
                              className={`inline mx-1 ${
                                user.id == session.ownerId &&
                                'font-bold text-secondary'
                              }`}
                            >
                              {user.name}
                            </li>
                          )),
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default SessionFinalized;
