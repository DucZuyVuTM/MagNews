import { useAuth } from '../../shared/hooks/useAuth';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';
import MobileMenu from '../MobileMenu';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src="/images/logo.png" width={35} height={35}></img>
            <span className="text-2xl font-bold text-gray-900">MagNews</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Publications
            </button>

            {token ? (
              <>
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'subscriptions'
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  My Subscriptions
                </button>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'admin'
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    currentPage === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">Register</span>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu */}
          <MobileMenu currentPage={currentPage} onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
}
