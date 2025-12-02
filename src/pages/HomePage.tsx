import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicationResponse } from '../types/api';
import SearchBar from '../components/layout/SearchBar';
import PublicationsList from '../components/publications/PublicationsList';
import PublicationDetail from '../components/publications/PublicationDetail';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
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

        <div className="mb-8 max-w-2xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Title or Publisher..."
          />
        </div>

        <PublicationsList
          searchQuery={searchQuery}
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
