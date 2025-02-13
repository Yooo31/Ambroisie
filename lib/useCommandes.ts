import { useEffect, useState } from 'react';

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

export const useCommandes = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCommandes = async () => {
    try {
      const response = await fetch('/api/commandes');
      const data: Commande[] = await response.json();
      setCommandes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  return { commandes, loading, fetchCommandes };
};
