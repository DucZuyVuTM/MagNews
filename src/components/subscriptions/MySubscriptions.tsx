import { useState, useEffect } from 'react';
import { api, ApiError } from '../../services/api';
import { SubscriptionResponse } from '../../types/api';
import { Calendar, DollarSign, RotateCw, X } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';

export default function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await api.subscriptions.getMy();
      setSubscriptions(data);
      setError('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load subscriptions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    setCancellingId(id);
    try {
      await api.subscriptions.cancel(id);
      await loadSubscriptions();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Failed to cancel subscription');
      }
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  if (loading) return <LoadingSpinner />

  if (error) return <ErrorState message={error} onRetry={loadSubscriptions} />

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">You don't have any subscriptions yet</p>
        <p className="text-sm text-gray-500">Browse publications to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4 w-full gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1 break-words">
                {subscription.publication.title}
              </h3>
              {subscription.publication.publisher && (
                <p className="text-sm text-gray-600 break-words">{subscription.publication.publisher}</p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                subscription.status
              )}`}
            >
              {subscription.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-start gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium">
                  {new Date(subscription.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm font-medium">
                  {new Date(subscription.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-sm font-medium break-words">${subscription.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {subscription.auto_renew ? (
                <>
                  <RotateCw className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Auto-renew enabled</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">Auto-renew disabled</span>
              )}
            </div>

            {subscription.status.toLowerCase() === 'active' && (
              <button
                onClick={() => handleCancel(subscription.id)}
                disabled={cancellingId === subscription.id}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                {cancellingId === subscription.id ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
