import { Luggage } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeMap = { sm: 'h-5 w-5', md: 'h-6 w-6', lg: 'h-10 w-10' };
  const textMap = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-gradient-to-br from-primary to-miami-orange p-1.5">
        <Luggage className={`${sizeMap[size]} text-white`} />
      </div>
      {showText && (
        <span className={`font-display font-bold ${textMap[size]} bg-gradient-to-r from-primary to-miami-orange bg-clip-text text-transparent`}>
          MalaBridge
        </span>
      )}
    </div>
  );
}
