import AdminPublications from '../components/admin/AdminPublications';

export default function AdminPage() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage publications and system settings
          </p>
        </div>

        <AdminPublications />
      </div>
    </div>
  );
}
