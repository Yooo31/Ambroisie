interface MenuSelectorProps {
  title: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const MenuSelector: React.FC<MenuSelectorProps> = ({
  title,
  count,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <button
        onClick={onDecrement}
        disabled={count === 0}
        className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        -
      </button>
      <span className="text-lg">
        {title} ({count})
      </span>
      <button onClick={onIncrement} className="bg-green-500 text-white px-3 py-1 rounded">
        +
      </button>
    </div>
  );
};
