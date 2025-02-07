'use client';

import { MenuCard } from '@/components/tools/MenuCard';
import { MenuSelector } from '@/components/tools/MenuSelector';
import { useState, useEffect } from 'react';

interface Order {
  number: number;
  menuAdulte: { entree: number; plat: number; dessert: number }[];
  menuEnfant: { plat: number; dessert: number }[];
}

interface OrderFormProps {
  orderNumber: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({ orderNumber }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [menuAdulteCount, setMenuAdulteCount] = useState(0);
  const [menuEnfantCount, setMenuEnfantCount] = useState(0);

  useEffect(() => {
    // Vérifier si une commande existe déjà
    const storedOrder = localStorage.getItem(`order-${orderNumber}`);
    if (storedOrder) {
      const parsedOrder: Order = JSON.parse(storedOrder);
      setOrder(parsedOrder);
    }
  }, [orderNumber]);

  const saveOrder = () => {
    const newOrder: Order = {
      number: orderNumber,
      menuAdulte: Array(menuAdulteCount).fill({ entree: 0, plat: 0, dessert: 0 }),
      menuEnfant: Array(menuEnfantCount).fill({ plat: 0, dessert: 0 }),
    };

    localStorage.setItem(`order-${orderNumber}`, JSON.stringify(newOrder));
    window.location.reload();
  };

  if (order) {
    return (
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-bold">Mise à jour de commande</h2>

        {/* Affichage des menus adultes */}
        {order.menuAdulte.map((menu, index) => (
          <MenuCard key={`adulte-${index}`} title={`Menu Adulte #${index + 1}`} menu={menu} />
        ))}

        {/* Affichage des menus enfants */}
        {order.menuEnfant.map((menu, index) => (
          <MenuCard key={`enfant-${index}`} title={`Menu Enfant #${index + 1}`} menu={menu} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Création de commande</h2>

      <div className="mt-4">
        <MenuSelector
          title="Menus Adultes"
          count={menuAdulteCount}
          onIncrement={() => setMenuAdulteCount(menuAdulteCount + 1)}
          onDecrement={() => setMenuAdulteCount(Math.max(0, menuAdulteCount - 1))}
        />
        <MenuSelector
          title="Menus Enfants"
          count={menuEnfantCount}
          onIncrement={() => setMenuEnfantCount(menuEnfantCount + 1)}
          onDecrement={() => setMenuEnfantCount(Math.max(0, menuEnfantCount - 1))}
        />
      </div>

      <button onClick={saveOrder} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full">
        Valider la commande
      </button>
    </div>
  );
};
