import { memo, useEffect, useState } from 'react';

interface ItemEaten {
  name: string;
  eatenBy: string[];
}

interface SessionItemProps {
  index: number;
  item: {
    id: string;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    sessionId: string;
  };
  itemsEaten: ItemEaten[];
  userName: string;
  onItemClick: (itemId: string) => void;
}

const SessionItem = memo(function SessionItem({
  index,
  item,
  itemsEaten,
  userName,
  onItemClick,
}: SessionItemProps) {
  const { id, name, price } = item;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(itemsEaten[index]?.eatenBy.includes(userName));
  }, [itemsEaten, index, userName]);

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);
    onItemClick(id);
  };

  return (
    <tr className="hover text-center">
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>
        {price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </td>
      <td>
        {itemsEaten[index]?.eatenBy.map((name, index) => (
          <div
            key={index}
            className={name === userName ? 'font-bold text-secondary' : ''}
          >
            {name}
          </div>
        ))}
      </td>
      <td>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={isSelected}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
      </td>
    </tr>
  );
});

export default SessionItem;
