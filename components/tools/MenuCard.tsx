import { MenuItem } from '@/components/tools/MenuItem';

interface Menu {
  entree?: number;
  plat: number;
  dessert: number;
}

interface MenuCardProps {
  title: string;
  menu: Menu;
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, menu }) => {
  return (
    <div className="mt-4 p-4 border rounded shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>

      <div className="mt-2 space-y-2">
        {'entree' in menu && <MenuItem title="Entrée" quantity={menu.entree || 0} />}
        <MenuItem title="Plat" quantity={menu.plat} />
        <MenuItem title="Dessert" quantity={menu.dessert} />
      </div>
    </div>
  );
};
