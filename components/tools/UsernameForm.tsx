import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UsernameFormProps {
  onSubmit: (name: string) => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    if (name) {
      onSubmit(name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Input
        value={name}
        onChange={handleChange}
        placeholder="Entrez votre nom d'utilisateur"
        className="mb-4 w-64"
      />
      <Button onClick={handleSubmit}>Enregistrer</Button>
    </div>
  );
};

export default UsernameForm;
