import { useEffect, useState } from 'react';

interface Order {
  serveurName: string;
  numeroTable: number;
  status: string;
  content: {
    adulte: { entree: number; plat: number; dessert: number };
    enfant: { plat: number; dessert: number };
  };
}

export const useCommandes = () => {
  const [commandes, setCommandes] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommandes = async () => {
    try {
      const res = await fetch('/api/commandes');
      const data = await res.json();
      setCommandes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
    const interval = setInterval(fetchCommandes, 5000);
    return () => clearInterval(interval);
  }, []);

  return { commandes, loading, fetchCommandes };
};
