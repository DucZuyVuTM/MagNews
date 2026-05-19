import { useAuth } from '../../shared/hooks/useAuth';
import ProviderPublications from '../../widgets/Provider/ProviderPublications';

export default function ProviderPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'provider') {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Publisher cabinet</h1>
          <p className="text-gray-600">
            Available only to users with the role of publisher.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Publisher cabinet
          </h1>
          <p className="text-lg text-gray-600">
            {user.company_name ?? 'Publisher'} — your publications and moderation status
          </p>
        </div>

        <ProviderPublications />
      </div>
    </div>
  );
}
