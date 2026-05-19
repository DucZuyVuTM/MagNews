import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { api, ApiError } from '../../../shared/api';
import {
  PublicationCreate,
  PublicationResponse,
  PublicationUpdate,
} from '../../../shared/types/api';
import PublicationForm from '../../../features/publications/PublicationForm';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';

const STATUS_BADGE: Record<PublicationResponse['moderation_status'], { label: string; cls: string; Icon: typeof Clock }> = {
  pending: {
    label: 'Pending moderation',
    cls: 'bg-yellow-100 text-yellow-800',
    Icon: Clock,
  },
  approved: {
    label: 'Approved',
    cls: 'bg-green-100 text-green-700',
    Icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    cls: 'bg-red-100 text-red-700',
    Icon: XCircle,
  },
};

export default function ProviderPublications() {
  const [publications, setPublications] = useState<PublicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PublicationResponse | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.publications.listMine();
      setPublications(data);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: PublicationCreate | PublicationUpdate) => {
    await api.publications.create(data as PublicationCreate);
    await load();
    setShowForm(false);
  };

  const handleUpdate = async (data: PublicationCreate | PublicationUpdate) => {
    if (!editing) return;
    await api.publications.update(editing.id, data as PublicationUpdate);
    await load();
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      await api.publications.delete(id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete publication');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex gap-3 items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My publications</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <p>Submit<span className="hidden md:inline"> publication</span></p>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderation</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((p) => {
                const badge = STATUS_BADGE[p.moderation_status];
                const Icon = badge.Icon;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 break-words">
                      <div className="text-sm font-medium text-gray-900 max-w-[50vw]">{p.title}</div>
                      {p.moderation_status === 'rejected' && p.moderation_note && (
                        <div className="text-xs text-red-600 mt-1">{p.moderation_note}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 break-words">
                      <div className="text-sm text-gray-900">${p.price_monthly.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 break-words">
                      <div className="text-sm text-gray-900">${p.price_yearly.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${badge.cls}`}>
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditing(p)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {publications.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">You have no publications yet</p>
          </div>
        )}
      </div>

      {showForm && (
        <PublicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <PublicationForm
          initialData={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          isEdit
        />
      )}
    </div>
  );
}
