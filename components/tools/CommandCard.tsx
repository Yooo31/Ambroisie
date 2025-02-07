import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContentItem {
  menu: string;
  element: string;
}

interface CommandeCardProps {
  number: number;
  status: string;
  content: ContentItem[];
  onClose: () => void;
}

const CommandeCard: React.FC<CommandeCardProps> = ({ number, status, content, onClose }) => {
  const statusColor =
    status === 'En cours' ? 'bg-yellow-500' : status === 'Prête' ? 'bg-green-500' : 'bg-red-500';

  console.log(content[0].menu);
  return (
    <Card className="w-full p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h2>Commande N°{number}</h2>
        <span className={`text-white px-2 py-1 rounded ${statusColor}`}>{status}</span>
      </div>
      <ul className="text-gray-600">
        {content.map((item: ContentItem, index: number) => (
          <li key={index}>{`${item.menu} - ${item.element}`}</li>
        ))}
      </ul>
      <Button onClick={onClose} className="mt-4 w-full">
        Clôturer la commande
      </Button>
    </Card>
  );
};

export default CommandeCard;
