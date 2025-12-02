import { useState } from 'react';
import { Menu, X, LogOut, User, BookOpen, Receipt, Shield, LogIn, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
  label: string;
  page: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MobileMenu({ currentPage, onNavigate }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setOpen(false);
  };

  const menuItems: MenuItem[] = token
    ? [
        { label: 'Publications', page: 'home', icon: BookOpen },
        { label: 'My Subscriptions', page: 'subscriptions', icon: Receipt },
        user?.role === 'admin' && { label: 'Admin Panel', page: 'admin', icon: Shield },
        { label: user?.username || 'Profile', page: 'profile', icon: User },
      ].filter(Boolean) as MenuItem[]
    : [
        { label: 'Publications', page: 'home', icon: BookOpen },
        { label: 'Sign In', page: 'login', icon: LogIn },
        { label: 'Register', page: 'register', icon: UserPlus },
      ];

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.page
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}

              {token && (
                <div className="border-t pt-3 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
