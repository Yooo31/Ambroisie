interface ServerHeaderProps {
  serverName: string;
}

const ServerHeader: React.FC<ServerHeaderProps> = ({ serverName }) => {
  return <h1 className="text-xl font-bold text-center">{`Serveur ${serverName}`}</h1>;
};

export default ServerHeader;
