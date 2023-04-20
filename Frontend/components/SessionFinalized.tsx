import { SessionProps } from '@/lib/types';

const SessionFinalized = ({ session, userSession }: SessionProps) => {
  return (
    <div className="flex flex-col items-center justify-center container min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-accent">
          {session.name}
        </h1>
        <div className="flex items-center justify-between mb-5">
          <div className="text-lg font-bold">
            Bill: ${session.bill ?? 'N/A'}
          </div>
          <div className="text-lg font-bold">Tip: ${session.tip}</div>
          <div className="text-lg font-bold">Tax: {session.tax}%</div>
        </div>
        <div className="mb-5">
          <p className="text-lg font-bold">Owner: {session.ownerName}</p>
        </div>
        <div>
          {session.items.map((item) => (
            <div key={item.id} className="mb-5">
              <p className="text-lg font-bold">{item.name}</p>
              <ul className="list-disc ml-5">
                {session.itemsEaten
                  .filter((itemEaten) => itemEaten.itemId === item.id)
                  .map((itemEaten) =>
                    itemEaten.eatenBy.map((user) => (
                      <li key={`${itemEaten.itemId}-${user}`}>{user}</li>
                    )),
                  )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionFinalized;
