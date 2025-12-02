import { useState } from 'react';
import { PublicationResponse } from '../../types/api';
import { api, ApiError } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { X, BookOpen, Newspaper, Calendar } from 'lucide-react';

interface PublicationDetailProps {
  publication: PublicationResponse;
  onClose: () => void;
  onSubscribed?: () => void;
}

export default function PublicationDetail({
  publication,
  onClose,
  onSubscribed,
}: PublicationDetailProps) {
  const { token } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState<1 | 12>(12);
  const [autoRenew, setAutoRenew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const Icon = publication.type === 'magazine' ? BookOpen : Newspaper;
  const price = selectedDuration === 1 ? publication.price_monthly : publication.price_yearly;

  const handleSubscribe = async () => {
    if (!token) {
      setError('Please login to subscribe');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.subscriptions.create({
        publication_id: publication.id,
        duration_months: selectedDuration,
        auto_renew: autoRenew,
      });
      setSuccess(true);
      setTimeout(() => {
        onSubscribed?.();
        onClose();
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create subscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900 overflow-y-auto whitespace-nowrap">{publication.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <div className="flex-shrink-0 w-full sm:w-48 h-64 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              {publication.cover_image_url ? (
                <img
                  src={publication.cover_image_url}
                  alt={publication.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Icon className="w-24 h-24 text-white opacity-80" />
              )}
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                  {publication.type}
                </span>
                {!publication.is_available && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    Unavailable
                  </span>
                )}
              </div>

              {publication.publisher && (
                <p className="text-gray-700 font-medium mb-2 break-words">{publication.publisher}</p>
              )}

              {publication.frequency && (
                <div className="flex items-center gap-2 text-gray-600 mb-3 overflow-x-auto">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{publication.frequency}</span>
                </div>
              )}

              {publication.description && (
                <p className="text-gray-700 leading-relaxed break-words">{publication.description}</p>
              )}
            </div>
          </div>

          {publication.is_available && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Subscribe</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                  Subscription created successfully!
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Duration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedDuration(1)}
                    className={`px-2 py-6 max-w-full border-2 rounded-lg transition-all ${
                      selectedDuration === 1
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="text-lg font-bold text-gray-900 break-words">
                      ${publication.price_monthly.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">per month</p>
                  </button>

                  <button
                    onClick={() => setSelectedDuration(12)}
                    className={`px-2 py-6 max-w-full border-2 rounded-lg transition-all relative ${
                      selectedDuration === 12
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="absolute top-1.5 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs rounded max-w-[90%] whitespace-nowrap truncate">
                      Save {(((publication.price_monthly * 12 - publication.price_yearly) / (publication.price_monthly * 12)) * 100).toFixed(0)}%
                    </span>
                    <p className="text-lg font-bold text-gray-900 break-words">
                      ${publication.price_yearly.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">per year</p>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Auto-renew subscription</span>
                </label>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={loading || !token}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
              >
                <p className="break-words">{loading ? 'Processing...' : `Subscribe for $${price.toFixed(2)}`}</p>
              </button>

              {!token && (
                <p className="text-sm text-gray-600 text-center mt-3">
                  Please login to subscribe
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
