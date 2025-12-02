import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../../services/api';
import { PublicationResponse } from '../../types/api';
import PublicationCard from './PublicationCard';
import { Filter } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';

interface PublicationsListProps {
  searchQuery: string;
  onSelectPublication: (publication: PublicationResponse) => void;
  onTypeFilterChange: (type: string) => void;
}

export default function PublicationsList({
  searchQuery,
  onSelectPublication,
  onTypeFilterChange,
}: PublicationsListProps) {
  const [searchParams] = useSearchParams();
  const [publications, setPublications] = useState<PublicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filteredPublications = useMemo(() => {
    if (!searchQuery) return publications;
    
    return publications.filter(pub =>
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pub.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [publications, searchQuery]);

  const typeFilter = searchParams.get('type') || '';

  const loadPublications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.publications.list({
        type: typeFilter || undefined,
      });
      setPublications(data);
      setError('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load publications');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const types = useMemo(() => {
    return Array.from(new Set(filteredPublications.map(p => p.type)));
  }, [filteredPublications]);

  if (loading) return <LoadingSpinner />

  if (error) return <ErrorState message={error} onRetry={loadPublications} />

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onTypeFilterChange('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              typeFilter === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onTypeFilterChange(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                typeFilter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredPublications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No publications found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPublications.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              onClick={() => onSelectPublication(publication)}
            />
          ))}
        </div>
      )}

      {searchQuery && (
        <p className="text-center text-gray-600 mt-6">
          Found <span className="font-bold text-blue-600">{filteredPublications.length}</span> publication{filteredPublications.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      )}
    </div>
  );
}
