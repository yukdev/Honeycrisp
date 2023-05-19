'use client';
import { useLocalStorage } from '@/lib/hooks';

interface DemoTaskProps {
  taskName: string;
}

const DemoTask = ({ taskName }: DemoTaskProps) => {
  const [complete, setComplete] = useLocalStorage(taskName, false);

  const toggleComplete = () => {
    setComplete(!complete);
  };

  return (
    <input
      type="checkbox"
      checked={complete}
      className="checkbox checkbox-success ml-2"
      onChange={toggleComplete}
    />
  );
};

export default DemoTask;
