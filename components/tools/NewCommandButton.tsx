import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NewCommandeButton = () => {
  return (
    <Link href="/serveur/commande">
      <Button className="w-full">Nouvelle commande</Button>
    </Link>
  );
};

export default NewCommandeButton;
