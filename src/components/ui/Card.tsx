import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
  id?: string;
}

/**
 * Composant Card réutilisable pour contenir du contenu avec différentes variantes
 */
export function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  id,
}: CardProps) {
  // Classes de padding selon la prop
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Classes d'ombre selon la prop
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      id={id}
      className={`
        bg-white rounded-lg transition-all duration-200
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${border ? 'border border-gray-200' : ''}
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
