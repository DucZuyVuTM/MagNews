import { useState, useEffect } from 'react';
import { api, ApiError } from '../../services/api';
import { PublicationResponse, PublicationCreate, PublicationUpdate } from '../../types/api';
import PublicationForm from './PublicationForm';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminPublications() {
  const [publications, setPublications] = useState<PublicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<PublicationResponse | null>(null);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const data = await api.publications.listAll();
      setPublications(data);
      setError('');
    } catch (err) {
      setError('Failed to load publications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: PublicationCreate | PublicationUpdate) => {
    await api.publications.create(data as PublicationCreate);
    await loadPublications();
    setShowForm(false);
  };

  const handleUpdate = async (data: PublicationCreate | PublicationUpdate) => {
    if (!editingPublication) return;
    
    await api.publications.update(editingPublication.id, data as PublicationUpdate);
    await loadPublications();
    setEditingPublication(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return;
    }

    try {
      await api.publications.delete(id);
      await loadPublications();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Failed to delete publication');
      }
    }
  };

  const handleToggleVisibility = async (publication: PublicationResponse) => {
    try {
      await api.publications.update(publication.id, {
        is_visible: !publication.is_visible,
      });
      await loadPublications();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('Failed to update publication');
      }
    }
  };

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex gap-3 items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Publications</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <p>Add<span className="hidden md:inline"> Publication</span></p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publisher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yearly
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((publication) => (
                <tr key={publication.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 break-words">
                    <div className="text-sm font-medium text-gray-900 max-w-[50vw]">{publication.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                      {publication.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 break-words">
                    <div className="text-sm text-gray-600 max-w-[50vw]">{publication.publisher || '-'}</div>
                  </td>
                  <td className="px-6 py-4 break-words">
                    <div className="text-sm text-gray-900 max-w-[50vw]">${publication.price_monthly.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 break-words">
                    <div className="text-sm text-gray-900 max-w-[50vw]">${publication.price_yearly.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleVisibility(publication)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                        publication.is_visible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {publication.is_visible ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingPublication(publication)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(publication.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {publications.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No publications found</p>
          </div>
        )}
      </div>

      {showForm && (
        <PublicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingPublication && (
        <PublicationForm
          initialData={editingPublication}
          onSubmit={handleUpdate}
          onCancel={() => setEditingPublication(null)}
          isEdit
        />
      )}
    </div>
  );
}
