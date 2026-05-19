import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { api, ApiError } from '../../../shared/api';
import { PublicationResponse } from '../../../shared/types/api';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';

export default function AdminModeration() {
  const [items, setItems] = useState<PublicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [acting, setActing] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.publications.listPending();
      setItems(data);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: number) => {
    setActing(id);
    try {
      await api.publications.moderate(id, { decision: 'approve' });
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to approve');
    } finally {
      setActing(null);
    }
  };

  const reject = async (id: number) => {
    if (!rejectNote.trim()) {
      alert('Please provide a comment to the rejection');
      return;
    }
    setActing(id);
    try {
      await api.publications.moderate(id, {
        decision: 'reject',
        note: rejectNote.trim(),
      });
      setRejectingId(null);
      setRejectNote('');
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to reject');
    } finally {
      setActing(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderation queue</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-600">
          No publications waiting for moderation
        </div>
      )}

      <div className="space-y-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-lg font-semibold text-gray-900 break-words">{p.title}</h3>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                    {p.type}
                  </span>
                  {p.publisher && (
                    <span className="text-xs text-gray-500">{p.publisher}</span>
                  )}
                </div>
                {p.description && (
                  <p className="text-sm text-gray-700 mb-3 break-words">{p.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Monthly ${p.price_monthly.toFixed(2)} · Yearly ${p.price_yearly.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approve(p.id)}
                  disabled={acting === p.id}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setRejectingId(p.id === rejectingId ? null : p.id)}
                  disabled={acting === p.id}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>

            {rejectingId === p.id && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for rejection *
                </label>
                <textarea
                  rows={3}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => reject(p.id)}
                    disabled={acting === p.id || !rejectNote.trim()}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm"
                  >
                    Confirm rejection
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setRejectNote('');
                    }}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
