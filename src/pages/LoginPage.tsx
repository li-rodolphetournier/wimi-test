import { LoginForm } from '@/components/features/auth/LoginForm';
import { PageTransition } from '@/components/ui/animations/PageTransition';
import { FadeIn } from '@/components/ui/animations/FadeIn';

export function LoginPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <FadeIn delay={0.2}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Wimi Todo</h1>
              <p className="text-gray-600">Gérez vos tâches efficacement</p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <LoginForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}