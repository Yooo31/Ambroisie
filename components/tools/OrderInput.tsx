'use client';

import { useState } from 'react';

interface OrderInputProps {
  onConfirm: (orderNumber: number) => void;
}

export const OrderInput: React.FC<OrderInputProps> = ({ onConfirm }) => {
  const [orderNumber, setOrderNumber] = useState('');

  const handleConfirm = () => {
    const number = parseInt(orderNumber, 10);
    if (!isNaN(number) && number > 0) {
      onConfirm(number);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder="Numéro de commande"
        className="border p-2 rounded w-full"
      />
      <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded">
        Confirmer
      </button>
    </div>
  );
};
