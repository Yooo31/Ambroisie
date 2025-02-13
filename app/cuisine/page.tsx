'use client';

import { useCommandes } from '@/lib/useCommandes';

const CuisinePage = () => {
  const { commandes, loading, fetchCommandes } = useCommandes();

  const markAsReady = async (numeroTable: number) => {
    try {
      await fetch('/api/commandes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTable, status: 'Prête' }),
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
        {commandes.map((cmd) => (
          <div key={cmd.numeroTable} className="border p-4 rounded shadow">
            <h2 className="text-lg font-bold">
              Table {cmd.numeroTable} - {cmd.serveurName}
            </h2>
            <p
              className={`text-sm ${cmd.status === 'Prête' ? 'text-green-500' : 'text-yellow-500'}`}
            >
              {cmd.status}
            </p>

            {cmd.content ? (
              <ul className="mt-2 text-gray-700">
                <li>
                  🧑‍🍽️ Adulte: {cmd.content.adulte?.entree || 0} entrées,{' '}
                  {cmd.content.adulte?.plat || 0} plats, {cmd.content.adulte?.dessert || 0} desserts
                </li>
                <li>
                  👶 Enfant: {cmd.content.enfant?.plat || 0} plats,{' '}
                  {cmd.content.enfant?.dessert || 0} desserts
                </li>
              </ul>
            ) : (
              <p className="text-red-500">Commande vide</p>
            )}

            {cmd.status !== 'Prête' && (
              <button
                onClick={() => markAsReady(cmd.numeroTable)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
              >
                ✅ Commande prête
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisinePage;
