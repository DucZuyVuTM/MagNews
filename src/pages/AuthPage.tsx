import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

interface AuthPageProps {
  onSuccess: () => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {mode === 'login' ? (
        <LoginForm
          onSuccess={onSuccess}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <RegisterForm
          onSuccess={onSuccess}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </div>
  );
}
