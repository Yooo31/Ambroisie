'use client';

import { useState, useEffect } from 'react';
import { MenuCard } from '@/components/tools/MenuCard';

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

  const updateOrder = async (updatedContent: MenuItem[]) => {
    try {
      await fetch('/api/commandes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTable: orderNumber, content: updatedContent }),
      });

      setOrder((prev) => (prev ? { ...prev, content: updatedContent } : prev));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande', error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (!order) return <p>Aucune commande trouvée.</p>;

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Commandes pour la table {order.numeroTable}</h2>

      {order.content.map((menu, index) => (
        <MenuCard
          key={index}
          title={`Menu ${menu.type}`}
          menu={menu}
          onUpdate={(updatedMenu) => {
            const updatedContent = [...order.content];
            updatedContent[index] = updatedMenu;
            updateOrder(updatedContent);
          }}
        />
      ))}
    </div>
  );
};
