import { BookOpen, Newspaper } from 'lucide-react';
import { PublicationResponse } from '../../../../shared/types/api';

interface PublicationCardProps {
  publication: PublicationResponse;
  onClick: () => void;
}

export default function PublicationCard({ publication, onClick }: PublicationCardProps) {
  const Icon = publication.type === 'magazine' ? BookOpen : Newspaper;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        {publication.cover_image_url ? (
          <img
            src={publication.cover_image_url}
            alt={publication.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-20 h-20 text-white opacity-80" />
        )}
        {!publication.is_available && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2 gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
              {publication.title}
            </h3>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {publication.type}
          </span>
        </div>

        {publication.publisher && (
          <p className="text-sm text-gray-600 mb-2 break-words">{publication.publisher}</p>
        )}

        {publication.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2 break-words">
            {publication.description}
          </p>
        )}

        {publication.frequency && (
          <p className="text-xs text-gray-500 mb-3 break-words">{publication.frequency}</p>
        )}

        <div className="flex items-start justify-between pt-3 border-t border-gray-200">
          <div className="max-w-[40%]">
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="text-lg font-bold text-gray-900 break-words">
              ${publication.price_monthly.toFixed(2)}
            </p>
          </div>
          <div className="text-right max-w-[40%]">
            <p className="text-xs text-gray-500">Yearly</p>
            <p className="text-lg font-bold text-gray-900 break-words">
              ${publication.price_yearly.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
