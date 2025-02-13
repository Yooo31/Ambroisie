interface Menu {
  type: 'adulte' | 'enfant';
  entree?: string;
  plat: string;
  dessert: string;
}

interface MenuCardProps {
  title: string;
  menu?: Menu;
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, menu }) => {
  if (!menu) {
    return <p className="text-red-500">Menu non disponible</p>;
  }

  return (
    <div className="mt-4 p-4 border rounded shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>

      <div className="mt-2 space-y-2">
        {menu.entree && <p>Entrée : {menu.entree}</p>}
        <p>Plat : {menu.plat}</p>
        <p>Dessert : {menu.dessert}</p>
      </div>
    </div>
  );
};
