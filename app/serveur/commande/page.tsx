'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OrderInput } from '@/components/tools/OrderInput';
import { OrderForm } from '@/components/tools/OrderForm';

const CommandesPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/serveur" className="text-gray-700 hover:text-black">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Gestion Commandes</h1>
      </div>

      <OrderInput onConfirm={setSelectedOrder} />

      {selectedOrder !== null && <OrderForm orderNumber={selectedOrder} />}
    </div>
  );
};

export default CommandesPage;
