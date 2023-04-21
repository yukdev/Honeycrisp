'use client';
import { SessionProps } from '@/lib/types';
import { useState } from 'react';
import { togglePaid } from '@/lib/api';
import { useRouter } from 'next/navigation';
interface UserSplit {
  id: string;
  name: string;
  split: number;
  paid: boolean;
}

const SessionFinalized = ({ session, userSession }: SessionProps) => {
  const router = useRouter();
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
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingUserId(null);
    }
  };
  return (
    <>
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
                                user.id == userId && 'font-bold text-secondary'
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
    </>
  );
};

export default SessionFinalized;
