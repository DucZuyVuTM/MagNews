import { useNavigate } from 'react-router-dom';
import LoginForm from '../../features/auth/LoginForm';
import RegisterForm from '../../features/auth/RegisterForm';

interface AuthPageProps {
  onSuccess: () => void;
  mode: 'login' | 'register'
}

export default function AuthPage({ onSuccess, mode }: AuthPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {mode === 'login' ? (
        <LoginForm
          onSuccess={onSuccess}
          onSwitchToRegister={() => navigate("/register")}
        />
      ) : (
        <RegisterForm
          onSuccess={onSuccess}
          onSwitchToLogin={() => navigate("/login")}
        />
      )}
    </div>
  );
}
