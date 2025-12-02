import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { api } from './services/api';

import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/layout/Footer';

function AppContent() {
  const { token, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname.slice(1) || 'home'; // '' --> 'home'

  useEffect(() => {
    const handleForceHome = () => {
      navigate('/');
    };

    window.addEventListener('auth:force-home', handleForceHome);

    return () => {
      window.removeEventListener('auth:force-home', handleForceHome);
    };
  }, [navigate]);

  useEffect(() => {
    if (token) {
      api.users.getMe()
        .then(setUser)
        .catch(() => {
          console.error('Failed to load user data');
        });
    }
  }, [token, setUser]);

  const handleNavigate = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage onSuccess={handleAuthSuccess} mode={'login'} />} />
          <Route path="/register" element={<AuthPage onSuccess={handleAuthSuccess} mode={'register'} />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Redirect all strange links to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
