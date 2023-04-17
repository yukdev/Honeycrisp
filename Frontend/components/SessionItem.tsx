import { memo } from 'react';

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
  isSelected: boolean;
  onItemClick: (itemId: string) => void;
}

const SessionItem = memo(function SessionItem({
  index,
  item,
  isSelected,
  onItemClick,
}: SessionItemProps) {
  const { id, name, price } = item;

  const handleCheckboxChange = () => {
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
