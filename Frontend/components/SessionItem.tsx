import { memo, useEffect, useState } from 'react';

interface ItemEaten {
  name: string;
  eatenBy: {
    id: string;
    name: string;
  }[];
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
  userId: string;
  onItemClick: (itemId: string) => void;
}

const SessionItem = memo(function SessionItem({
  index,
  item,
  itemsEaten,
  userId,
  onItemClick,
}: SessionItemProps) {
  const { id, name, price } = item;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(
      itemsEaten[index]?.eatenBy.some((user) => user.id === userId),
    );
  }, [itemsEaten, index, userId]);

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);
    onItemClick(id);
  };

  return (
    <tr className="hover">
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>
        {price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </td>
      <td>
        {itemsEaten[index]?.eatenBy.map((eater, index) => (
          <div
            key={index}
            className={eater.id === userId ? 'font-bold text-secondary' : ''}
          >
            {eater.name}
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
