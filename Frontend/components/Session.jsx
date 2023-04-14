'use client';
// import { getSession } from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';
import SessionItem from './SessionItem';
// import LoadingPage from '../app/loading';

const Session = ({ session }) => {
  const { items } = session;

  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemClick = useCallback(
    (itemId) => {
      setSelectedItems((prevItems) =>
        prevItems.includes(itemId)
          ? prevItems.filter((id) => id !== itemId)
          : [...prevItems, itemId],
      );
    },
    [setSelectedItems],
  );

  const handleSubmit = () => {
    console.log(selectedItems);
  };

  return (
    <div className="flex flex-col items-center justify-center container min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">{session.name}</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-center">
              <th></th>
              <th>Item</th>
              <th>Price</th>
              <th>Ate?</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <SessionItem
                key={item.id}
                index={index}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onItemClick={handleItemClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary my-3">
        Submit
      </button>
    </div>
  );
};

export const revalidate = 60;

export default Session;
