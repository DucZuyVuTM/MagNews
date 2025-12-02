import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicationsList from '../components/publications/PublicationsList';
import PublicationDetail from '../components/publications/PublicationDetail';
import { PublicationResponse } from '../types/api';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPublication, setSelectedPublication] = useState<PublicationResponse | null>(null);

  const handleTypeFilterChange = (newType: string) => {
    if (newType === '') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', newType);
    }
    setSearchParams(searchParams);
  };

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

        <PublicationsList
          onTypeFilterChange={handleTypeFilterChange}
          onSelectPublication={setSelectedPublication}
        />

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
