'use client';

import { useCommandes } from '@/lib/useCommandes';

const CuisinePage = () => {
  const { commandes, loading, fetchCommandes } = useCommandes();

  const markAsReady = async (numeroTable: number, index: number, element: string) => {
    await fetch('/api/commandes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numeroTable, index, element, newStatus: 'prêt' }),
    });
    fetchCommandes();
  };

  if (loading) return <p>Chargement des commandes...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cuisine - Commandes en cours</h1>
      <div className="space-y-4">
        {commandes.map((cmd) => (
          <div key={cmd.numeroTable}>
            <h2>Table {cmd.numeroTable} - {cmd.serveurName}</h2>
            {cmd.content && cmd.content.length > 0 ? (
              cmd.content.map((menu, index) => (
                <div key={index}>
                  {Object.entries(menu).map(([key, value]) =>
                    key !== 'type' && value === 'commandé' && (
                      <button key={key} onClick={() => markAsReady(cmd.numeroTable, index, key)}>
                        {menu.type} - {key} → Prêt
                      </button>
                    )
                  )}
                </div>
              ))
            ) : (
              <p className="text-red-500">Aucune commande en cours</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisinePage;
