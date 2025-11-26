import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { PublicationResponse } from '../../types/api';
import PublicationCard from './PublicationCard';
import { Filter } from 'lucide-react';

interface PublicationsListProps {
  onSelectPublication: (publication: PublicationResponse) => void;
}

export default function PublicationsList({ onSelectPublication }: PublicationsListProps) {
  const [publications, setPublications] = useState<PublicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const loadPublications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.publications.list({
        type: typeFilter || undefined,
      });
      setPublications(data);
      setError('');
    } catch (err) {
      setError('Failed to load publications, you may have to register or sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const types = Array.from(new Set(publications.map(p => p.type)));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadPublications}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTypeFilter('')}
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
              onClick={() => setTypeFilter(type)}
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

      {publications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No publications found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publications.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              onClick={() => onSelectPublication(publication)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
