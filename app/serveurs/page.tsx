'use client';

import { useState, useEffect } from 'react';
import UsernameForm from '@/components/tools/UsernameForm';
import ServerHeader from '@/components/tools/ServerHeader';
import NewCommandeButton from '@/components/tools/NewCommandButton';
import CommandeCard from '@/components/tools/CommandCard';

const Commandes = [
  {
    number: 1,
    status: 'En cours',
    content: [
      { menu: 'Adulte', element: 'Entrée' },
      { menu: 'Adulte', element: 'Entrée' },
      { menu: 'Adulte', element: 'Plat' },
      { menu: 'Enfant', element: 'Dessert' },
    ],
  },
  {
    number: 2,
    status: 'Terminée',
    content: [
      { menu: 'Adulte', element: 'Entrée' },
      { menu: 'Adulte', element: 'Entrée' },
      { menu: 'Adulte', element: 'Plat' },
      { menu: 'Enfant', element: 'Dessert' },
    ],
  },
  {
    number: 3,
    status: 'Prête',
    content: [
      { menu: 'Adulte', element: 'Entrée' },
      { menu: 'Adulte', element: 'Entrée' },
      { menu: 'Adulte', element: 'Plat' },
      { menu: 'Enfant', element: 'Dessert' },
    ],
  },
];

const ServeurPage = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleUserNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  if (!userName) {
    return <UsernameForm onSubmit={handleUserNameSubmit} />;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <ServerHeader serverName={userName} />
      <NewCommandeButton />
      <div className="w-full mt-4 space-y-4">
        {Commandes.map(({ number, status, content }) => (
          <CommandeCard
            key={number}
            number={number}
            status={status}
            content={content}
            onClose={() => console.log('Clôturer la commande')}
          />
        ))}
      </div>
    </div>
  );
};

export default ServeurPage;
