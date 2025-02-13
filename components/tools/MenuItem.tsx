interface MenuItemProps {
  title: string;
  status: string;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ title, status, onClick }) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <span>{title}</span>
      {status === 'attente' ? (
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={onClick}
        >
          Commander
        </button>
      ) : (
        <span className="bg-green-500 text-white px-3 py-1 rounded">{status}</span>
      )}
    </div>
  );
};
