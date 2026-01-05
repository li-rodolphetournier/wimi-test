import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  isLoading?: boolean;
}

/**
 * Composant Checkbox réutilisable avec label et gestion d'état de chargement
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, isLoading = false, disabled, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only" // Screen reader only - input caché
            disabled={disabled || isLoading}
            {...props}
          />
          {/* Checkbox visuel personnalisé */}
          <div
            className={`
              w-5 h-5 border-2 rounded transition-all duration-200
              flex items-center justify-center
              ${
                props.checked
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 group-hover:border-blue-400'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${className}
            `}
          >
            {/* Icône de check */}
            {props.checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Spinner de chargement */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Label */}
        {label && (
          <span
            className={`
              text-sm font-medium transition-colors duration-200
              ${props.checked ? 'text-gray-900' : 'text-gray-700'}
              ${disabled || isLoading ? 'text-gray-400' : 'group-hover:text-gray-900'}
            `}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
