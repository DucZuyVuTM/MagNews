import { useState } from 'react';
import PublicationsList from '../components/publications/PublicationsList';
import PublicationDetail from '../components/publications/PublicationDetail';
import { PublicationResponse } from '../types/api';

export default function HomePage() {
  const [selectedPublication, setSelectedPublication] = useState<PublicationResponse | null>(null);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Publications
          </h1>
          <p className="text-lg text-gray-600">
            Browse and subscribe to your favorite magazines and newspapers
          </p>
        </div>

        <PublicationsList onSelectPublication={setSelectedPublication} />

        {selectedPublication && (
          <PublicationDetail
            publication={selectedPublication}
            onClose={() => setSelectedPublication(null)}
            onSubscribed={() => setSelectedPublication(null)}
          />
        )}
      </div>
    </div>
  );
}
