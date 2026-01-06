import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
  );
}