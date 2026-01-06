import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccessToast(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data.email, data.password);
  };

  return (
    <>
      {showSuccessToast && (
        <Toast
          message="Connexion réussie ! Redirection en cours..."
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={clearError}
          duration={5000}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">Connexion</h2>

      <Input
        label="Email"
        type="email"
        placeholder="exemple@email.com"
        {...register('email', {
          required: 'L\'email est requis',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email invalide',
          },
        })}
        error={errors.email?.message}
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="Votre mot de passe"
        {...register('password', {
          required: 'Le mot de passe est requis',
          minLength: {
            value: 6,
            message: 'Le mot de passe doit contenir au moins 6 caractères',
          },
        })}
        error={errors.password?.message}
      />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Se connecter
        </Button>
      </form>
    </>
  );
}