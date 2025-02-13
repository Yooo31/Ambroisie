import { MenuItem } from '@/components/tools/MenuItem';

interface MenuItemProps {
  type: 'adulte' | 'enfant';
  entree?: string;
  plat: string;
  dessert: string;
}

interface MenuCardProps {
  title: string;
  menu: MenuItemProps;
  onUpdate: (updatedMenu: MenuItemProps) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, menu, onUpdate }) => {
  const handleUpdate = (field: keyof MenuItemProps) => {
    if (menu[field] === 'attente') {
      onUpdate({ ...menu, [field]: 'commandé' });
    }
  };

  return (
    <div className="mt-4 p-4 border rounded shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>

      <div className="mt-2 space-y-2">
        {'entree' in menu && (
          <MenuItem title="Entrée" status={menu.entree || ''} onClick={() => handleUpdate('entree')} />
        )}
        <MenuItem title="Plat" status={menu.plat} onClick={() => handleUpdate('plat')} />
        <MenuItem title="Dessert" status={menu.dessert} onClick={() => handleUpdate('dessert')} />
      </div>
    </div>
  );
};
