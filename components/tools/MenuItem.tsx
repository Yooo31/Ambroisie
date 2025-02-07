interface MenuItemProps {
  title: string;
  quantity: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({ title, quantity }) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <span>{title}</span>
      {quantity === 0 ? (
        <button className="bg-blue-500 text-white px-3 py-1 rounded">Commander</button>
      ) : (
        <span className="bg-green-500 text-white px-3 py-1 rounded">Reçu</span>
      )}
    </div>
  );
};
