import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { api } from './services/api';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { token, setUser } = useAuth();

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
    setCurrentPage(page);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'auth' && <AuthPage onSuccess={handleAuthSuccess} />}
      {currentPage === 'subscriptions' && <SubscriptionsPage />}
      {currentPage === 'admin' && <AdminPage />}
      {currentPage === 'profile' && <ProfilePage />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
