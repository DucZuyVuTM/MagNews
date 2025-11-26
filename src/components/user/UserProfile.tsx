import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user.full_name || user.username}</h1>
              <p className="text-blue-100">@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>
              </div>

              {user.full_name && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900 font-medium">{user.full_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full mt-0.5 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${user.is_active ? 'text-green-700' : 'text-red-700'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
