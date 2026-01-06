import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/animations';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      showToast({
        message: 'Connexion réussie ! Redirection en cours...',
        type: 'success',
        duration: 1000,
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  }, [isAuthenticated, navigate, showToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data.email, data.password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      showToast({
        message: errorMessage,
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <FadeIn delay={0.4}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="john.doe@example.com"
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
          id="password"
          placeholder="password123"
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
    </FadeIn>
  );
}