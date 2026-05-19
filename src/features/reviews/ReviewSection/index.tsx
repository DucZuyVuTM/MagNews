import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { api, ApiError } from '../../../shared/api';
import {
  PublicationRatingSummary,
  ReviewResponse,
} from '../../../shared/types/api';
import { useAuth } from '../../../shared/hooks/useAuth';

interface ReviewSectionProps {
  publicationId: number;
}

export default function ReviewSection({ publicationId }: ReviewSectionProps) {
  const { token } = useAuth();
  const [summary, setSummary] = useState<PublicationRatingSummary | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [list, sum] = await Promise.all([
        api.reviews.listByPublication(publicationId),
        api.reviews.getSummary(publicationId),
      ]);
      setReviews(list);
      setSummary(sum);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [publicationId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await api.reviews.create({
        publication_id: publicationId,
        rating,
        text: text.trim() || undefined,
      });
      setText('');
      setRating(5);
      setSubmitted(true);
      await load();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
        {summary && summary.review_count > 0 && summary.average_rating !== null && (
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">
              {summary.average_rating.toFixed(1)} / 5
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({summary.review_count})
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
          {error}
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-md p-4">
          {submitted && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 rounded text-xs">
              Review saved
            </div>
          )}
          {submitError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
              {submitError}
            </div>
          )}

          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className="p-1"
                aria-label={`Rate ${n} stars`}
              >
                <Star
                  className={`w-6 h-6 ${
                    n <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your impressions (optional)"
            maxLength={2000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
          >
            {submitting ? 'Sending...' : 'Submit review'}
          </button>
        </form>
      )}

      {!token && (
        <p className="text-sm text-gray-500 mb-4">
          Sign in to leave a review.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet — be the first.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="bg-white border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${
                      n <= r.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.text && (
                <p className="text-sm text-gray-700 break-words">{r.text}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
