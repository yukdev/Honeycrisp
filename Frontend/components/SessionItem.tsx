import { EatenBy, SessionItem } from '@/lib/types';

interface SessionItemProps {
  index: number;
  item: SessionItem;
  userId: string;
  eatenBy: EatenBy[];
  isSelected: boolean;
  onItemClick: (itemId: string) => void;
}

function SessionItem({
  index,
  item,
  userId,
  eatenBy,
  isSelected,
  onItemClick,
}: SessionItemProps) {
  const { id, name, price } = item;

  const handleCheckboxChange = () => {
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
        <div className="flex flex-col items-center space-y-1">
          {eatenBy.map((eater) => (
            <div
              key={eater.id}
              className={`badge badge-sm ${
                userId === eater.id && 'badge-primary'
              }`}
            >
              {eater.name}
            </div>
          ))}
        </div>
      </td>
      <td>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm md:checkbox-md"
              checked={isSelected}
              onChange={handleCheckboxChange}
              disabled={!userId}
            />
          </label>
        </div>
      </td>
    </tr>
  );
}

export default SessionItem;
