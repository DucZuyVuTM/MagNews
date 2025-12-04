import { useState } from 'react';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { api, ApiError } from '../../../../shared/api';
import { User, Mail, Lock, Save } from 'lucide-react';

export default function UserProfileEdit() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.full_name || '');

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  if (!user) {
    return <div className="text-center py-10 text-gray-600">Please login to view profile</div>;
  }

  const handleUpdateProfile = async () => {
    if (username === user.username && fullName === (user.full_name || '')) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updatedUser = await api.users.update({
        username: username !== user.username ? username : undefined,
        full_name: fullName || undefined,
      });

      setUser(updatedUser);
      setIsEditing(false);
      alert('Information updated successfully!');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Update failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setError('Password does not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.users.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      alert('Password changed successfully! Please log in again.');
      setPasswordData({ current_password: '', new_password: '', confirm_new_password: '' });
      setShowPasswordForm(false);
      window.dispatchEvent(new Event('auth:logout'));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Password change failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-10 text-white">
          <div className="flex items-center justify-between gap-5 flex-col text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-5 flex-col sm:flex-row">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 break-words">
                  {user.full_name || user.username}
                </h1>
                <p className="text-blue-100 break-words">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <p className="text-gray-900 font-medium break-words">{user.email}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4" /> Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium break-words">{user.username}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name..."
                  />
                ) : (
                  <p className="text-gray-900 font-medium break-words">
                    {user.full_name || <span className="text-gray-400">Not set up yet</span>}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setUsername(user.username);
                      setFullName(user.full_name || '');
                    }}
                    className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password changing */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6 gap-3">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Lock className="w-6 h-6 text-red-600" />
                Security
              </h2>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {showPasswordForm ? 'Hide' : 'Change Password'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New password (at least 8 characters, with lowercase, uppercase and numbers)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirm_new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_new_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-70"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ current_password: '', new_password: '', confirm_new_password: '' });
                    }}
                    className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Other information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                {user.role}
              </span>
            </div>
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
  );
}
