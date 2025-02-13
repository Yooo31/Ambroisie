import { useState, useEffect } from 'react';
import { MenuCard } from '@/components/tools/MenuCard';
import { MenuSelector } from '@/components/tools/MenuSelector';

interface Menu {
  type: 'adulte' | 'enfant';
  entree?: string;
  plat: string;
  dessert: string;
}

interface Order {
  serveurName: string;
  numeroTable: number;
  status: string;
  content: Menu[];
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
        const existingOrder = commandes.find((cmd: Order) => cmd.numeroTable === orderNumber);
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

  const saveOrder = async () => {
    const res = await fetch('/api/commandes');
    const commandes = await res.json();

    const existingOrder = commandes.find((cmd: Order) => cmd.numeroTable === orderNumber);

    const newMenus = [
      ...Array(menuAdulteCount).fill({
        type: 'adulte',
        entree: 'attente',
        plat: 'attente',
        dessert: 'attente',
      }),
      ...Array(menuEnfantCount).fill({ type: 'enfant', plat: 'attente', dessert: 'attente' }),
    ];

    if (existingOrder) {
      existingOrder.content.push(...newMenus);
      await fetch('/api/commandes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(existingOrder),
      });
    } else {
      await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serveurName,
          numeroTable: orderNumber,
          menuAdulteCount,
          menuEnfantCount,
        }),
      });
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (order) {
    return (
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-bold">Mise à jour de commande</h2>

        {/* Affichage des menus adultes */}
        <MenuCard title="Menu Adulte" menu={order.content.adulte} />

        {/* Affichage des menus enfants */}
        <MenuCard title="Menu Enfant" menu={order.content.enfant} />
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
