'use client';

import { useState } from 'react';
import { useCommandes } from '@/lib/useCommandes';

interface MenuItem {
  type: 'adulte' | 'enfant';
  entree?: string;
  plat: string;
  dessert: string;
}

interface Commande {
  serveurName: string;
  numeroTable: number;
  status: string;
  content: MenuItem[];
}

const CuisinePage = () => {
  const { commandes, loading, fetchCommandes } = useCommandes();
  const [rayedItems, setRayedItems] = useState<{ [key: string]: boolean }>({});

  const toggleRayer = (key: string) => {
    setRayedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markAsReady = async (numeroTable: number) => {
    try {
      const updatedCommandes = commandes.map((cmd) => {
        if (cmd.numeroTable === numeroTable) {
          return {
            ...cmd,
            status: 'prêt',
            content: cmd.content.map((menu) => ({
              ...menu,
              entree: menu.entree === 'commandé' ? 'prêt' : menu.entree,
              plat: menu.plat === 'commandé' ? 'prêt' : menu.plat,
              dessert: menu.dessert === 'commandé' ? 'prêt' : menu.dessert,
            })),
          };
        }
        return cmd;
      });

      await fetch('/api/commandes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTable, content: updatedCommandes.find((cmd) => cmd.numeroTable === numeroTable)?.content }),
      });

      fetchCommandes();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande', error);
    }
  };

  if (loading) return <p>Chargement des commandes...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cuisine - Commandes en cours</h1>
      <div className="space-y-4">
        {commandes.map((cmd: Commande) => {
          const items = cmd.content
            .flatMap((menu, index) => {
              const itemsList = [];
              if (menu.entree === 'commandé') itemsList.push({ id: `${cmd.numeroTable}-${index}-entree`, label: `Entrée ${menu.type}` });
              if (menu.plat === 'commandé') itemsList.push({ id: `${cmd.numeroTable}-${index}-plat`, label: `Plat ${menu.type}` });
              if (menu.dessert === 'commandé') itemsList.push({ id: `${cmd.numeroTable}-${index}-dessert`, label: `Dessert ${menu.type}` });
              return itemsList;
            });

          return (
            <div key={cmd.numeroTable} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-bold">
                Table {cmd.numeroTable} - {cmd.serveurName}
              </h2>

              <ul className="mt-2 text-gray-700">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={`flex justify-between items-center py-1 ${
                      rayedItems[item.id] ? 'line-through text-gray-400' : ''
                    }`}
                    onClick={() => toggleRayer(item.id)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => markAsReady(cmd.numeroTable)}
                className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded"
              >
                ✅ Commande prête
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CuisinePage;
