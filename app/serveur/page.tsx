'use client';

import { useState, useEffect } from 'react';
import UsernameForm from '@/components/tools/UsernameForm';
import ServerHeader from '@/components/tools/ServerHeader';
import NewCommandeButton from '@/components/tools/NewCommandButton';
import CommandeCard from '@/components/tools/CommandCard';
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

const ServeurPage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const { commandes, loading, fetchCommandes } = useCommandes();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const markAsDelivered = async (numeroTable: number) => {
    try {
      const updatedCommandes = commandes.map((cmd) => {
        if (cmd.numeroTable === numeroTable) {
          return {
            ...cmd,
            status: 'remis',
            content: cmd.content.map((menu) => ({
              ...menu,
              entree: menu.entree === 'prêt' ? 'remis' : menu.entree,
              plat: menu.plat === 'prêt' ? 'remis' : menu.plat,
              dessert: menu.dessert === 'prêt' ? 'remis' : menu.dessert,
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

  if (!userName) {
    return <UsernameForm onSubmit={(name) => { setUserName(name); localStorage.setItem('userName', name); }} />;
  }

  if (loading) return <p>Chargement des commandes...</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <ServerHeader serverName={userName} />
      <NewCommandeButton />

      <div className="w-full mt-4 space-y-4">
        {commandes.map((cmd: Commande) => (
          <div key={cmd.numeroTable} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-bold">Table {cmd.numeroTable} - {cmd.serveurName}</h2>

            <ul className="mt-2 text-gray-700">
              {cmd.content
                .filter((menu) => menu.entree === 'prêt' || menu.plat === 'prêt' || menu.dessert === 'prêt')
                .map((menu, index) => (
                  <li key={index} className="py-1">
                    {menu.type} - {menu.entree === 'prêt' ? 'Entrée' : menu.plat === 'prêt' ? 'Plat' : 'Dessert'}
                  </li>
                ))}
            </ul>

            <button
              onClick={() => markAsDelivered(cmd.numeroTable)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded"
            >
              🚀 Tout remis
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServeurPage;
