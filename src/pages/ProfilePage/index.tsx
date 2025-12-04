import UserProfile from '../../entities/user/ui/UserProfile';

export default function ProfilePage() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your account information
          </p>
        </div>

        <UserProfile />
      </div>
    </div>
  );
}
