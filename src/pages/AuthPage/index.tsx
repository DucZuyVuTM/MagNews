import { useNavigate } from 'react-router-dom';
import LoginForm from '../../features/auth/LoginForm';
import RegisterForm from '../../features/auth/RegisterForm';
import ProviderRegisterForm from '../../features/auth/ProviderRegisterForm';

interface AuthPageProps {
  onSuccess: () => void;
  mode: 'login' | 'register' | 'register-provider';
}

export default function AuthPage({ onSuccess, mode }: AuthPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      {mode !== 'login' && (
        <div className="mb-6 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'register' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Subscriber
          </button>
          <button
            type="button"
            onClick={() => navigate('/register-provider')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'register-provider' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Publisher
          </button>
        </div>
      )}

      {mode === 'login' && (
        <LoginForm
          onSuccess={onSuccess}
          onSwitchToRegister={() => navigate('/register')}
        />
      )}
      {mode === 'register' && (
        <RegisterForm
          onSuccess={onSuccess}
          onSwitchToLogin={() => navigate('/login')}
        />
      )}
      {mode === 'register-provider' && (
        <ProviderRegisterForm
          onSuccess={onSuccess}
          onSwitchToLogin={() => navigate('/login')}
        />
      )}
    </div>
  );
}
