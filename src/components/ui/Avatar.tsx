interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string; // Lettres à afficher si l'image ne charge pas
}

/**
 * Composant Avatar pour afficher l'image de profil utilisateur
 */
export function Avatar({
  src,
  alt,
  size = 'md',
  className = '',
  fallback,
}: AvatarProps) {
  // Classes de taille selon la prop
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Classes de texte pour le fallback selon la taille
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div
      className={`
        relative rounded-full overflow-hidden bg-gray-200
        flex items-center justify-center
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Masquer l'image si elle ne charge pas
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';

          // Afficher le fallback si fourni
          if (fallback && target.parentElement) {
            const fallbackElement = target.parentElement.querySelector('.avatar-fallback') as HTMLElement;
            if (fallbackElement) {
              fallbackElement.style.display = 'flex';
            }
          }
        }}
      />

      {/* Fallback avec initiales */}
      {fallback && (
        <div
          className={`
            avatar-fallback absolute inset-0
            items-center justify-center bg-gray-400 text-white font-medium
            hidden // Masqué par défaut, affiché si l'image ne charge pas
            ${textSizeClasses[size]}
          `}
          aria-label={`Avatar de ${alt}`}
        >
          {fallback}
        </div>
      )}
    </div>
  );
}
