'use client';

import { useState, useEffect } from 'react';
import { MenuCard } from '@/components/tools/MenuCard';
import { MenuSelector } from '@/components/tools/MenuSelector';

interface MenuItem {
  type: 'adulte' | 'enfant';
  entree?: string;
  plat: string;
  dessert: string;
}

interface Order {
  serveurName: string;
  numeroTable: number;
  status: string;
  content: MenuItem[];
}

interface OrderFormProps {
  orderNumber: number;
  serveurName: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({ orderNumber, serveurName }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuAdulteCount, setMenuAdulteCount] = useState(0);
  const [menuEnfantCount, setMenuEnfantCount] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch('/api/commandes');
        const commandes: Order[] = await res.json();

        const existingOrder = commandes.find((cmd) => cmd.numeroTable === orderNumber);
        if (existingOrder) {
          setOrder(existingOrder);
        }
      } catch (error) {
        console.error('Erreur de récupération des commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const updateMenuItem = async (index: number, updatedMenu: MenuItem) => {
    if (!order) return;

    const updatedContent = [...order.content];
    updatedContent[index] = updatedMenu;

    try {
      await fetch('/api/commandes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTable: order.numeroTable, content: updatedContent }),
      });

      setOrder((prev) => (prev ? { ...prev, content: updatedContent } : prev));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande', error);
    }
  };

  const saveOrder = async () => {
    if (menuAdulteCount === 0 && menuEnfantCount === 0) return;

    const newOrder: Order = {
      serveurName,
      numeroTable: orderNumber,
      status: 'En cours',
      content: [
        ...Array(menuAdulteCount).fill({
          type: 'adulte',
          entree: 'attente',
          plat: 'attente',
          dessert: 'attente',
        }),
        ...Array(menuEnfantCount).fill({ type: 'enfant', plat: 'attente', dessert: 'attente' }),
      ],
    };

    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        setOrder(newOrder);
      } else {
        console.error('Erreur lors de l’enregistrement de la commande');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (order) {
    return (
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-bold">Commandes pour la table {order.numeroTable}</h2>

        {order.content.map((menu, index) => (
          <MenuCard
            key={index}
            title={`Menu ${menu.type}`}
            menu={menu}
            onUpdate={(updatedMenu) => updateMenuItem(index, updatedMenu)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Création de commande</h2>

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

      <button onClick={saveOrder} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full">
        Valider la commande
      </button>
    </div>
  );
};
