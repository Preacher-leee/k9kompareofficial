import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

const Logo = ({ className = 'h-10 w-auto', isWhite = false }: LogoProps) => {
  return (
    <Link to="/" className="inline-block">
      <img 
        src="/logo.png" 
        alt="K9 Kompare Logo" 
        className={className}
      />
    </Link>
  );
};

export default Logo;