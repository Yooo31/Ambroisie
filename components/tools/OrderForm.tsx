'use client';

import { useState, useEffect } from 'react';
import { MenuCard } from '@/components/tools/MenuCard';
import { MenuSelector } from '@/components/tools/MenuSelector';

interface Order {
  serveurName: string;
  numeroTable: number;
  status: string;
  content: {
    adulte: { entree: number; plat: number; dessert: number };
    enfant: { plat: number; dessert: number };
  };
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

  // 🔍 Vérifier si une commande existe déjà
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

  // ✅ Sauvegarder une nouvelle commande
  const saveOrder = async () => {
    const newOrder: Order = {
      serveurName,
      numeroTable: orderNumber,
      status: 'En cours',
      content: {
        adulte: { entree: 0, plat: 0, dessert: 0 },
        enfant: { plat: 0, dessert: 0 },
      },
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
