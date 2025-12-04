import { API_BASE_URL } from '../config';
import {
  UserCreate,
  UserResponse,
  Token,
  PublicationCreate,
  PublicationUpdate,
  PublicationResponse,
  SubscriptionCreate,
  SubscriptionResponse,
} from '../types/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

let isHandling401 = false;

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401 && !isHandling401) {
    isHandling401 = true;

    localStorage.removeItem('token');
    alert('Your session has expired. Automatically logging out...');

    window.dispatchEvent(new Event('auth:logout'));
    setTimeout(() => {
      isHandling401 = false;
    }, 5000);
  }

  if (response.status === 401) {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  if (response.status === 422) {
    const url = new URL(response.url);
    const typeParam = url.searchParams.get('type');

    if (typeParam) {
      throw new ApiError(422, `Type "${typeParam}" is not available.`);
    } else {
      throw new ApiError(422, 'Error: Open Console in DevTools for details');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(response.status, error.detail || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  users: {
    register: (data: UserCreate) =>
      fetchApi<UserResponse>('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: async (login: string, password: string) => {
      const formData = new URLSearchParams();
      formData.append('login', login);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new ApiError(response.status, error.detail || 'Login failed');
      }

      return response.json() as Promise<Token>;
    },

    getMe: () => fetchApi<UserResponse>('/api/users/me'),

    update: (data: {
      username?: string;
      full_name?: string;
    }) => fetchApi<UserResponse>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(data)
    }),

    updatePassword: (data: {
      current_password: string;
      new_password: string;
    }) => fetchApi<{ message: string }>("/api/users/me/password", {
      method: "POST",
      body: JSON.stringify(data)
    })
  },

  publications: {
    listAll: () => fetchApi<PublicationResponse[]>('/api/publications/all'),

    list: (params?: { skip?: number; limit?: number; type?: string }) => {
      const query = new URLSearchParams();
      if (params?.skip !== undefined) query.append('skip', params.skip.toString());
      if (params?.limit !== undefined) query.append('limit', params.limit.toString());
      if (params?.type != null && params.type !== '') query.append('type', params.type);

      return fetchApi<PublicationResponse[]>(
        `/api/publications/?${query.toString()}`
      );
    },

    get: (id: number) =>
      fetchApi<PublicationResponse>(`/api/publications/${id}`),

    create: (data: PublicationCreate) =>
      fetchApi<PublicationResponse>('/api/publications/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: PublicationUpdate) =>
      fetchApi<PublicationResponse>(`/api/publications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      fetchApi<void>(`/api/publications/${id}`, {
        method: 'DELETE',
      }),
  },

  subscriptions: {
    create: (data: SubscriptionCreate) =>
      fetchApi<SubscriptionResponse>('/api/subscriptions/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getMy: () =>
      fetchApi<SubscriptionResponse[]>('/api/subscriptions/my'),

    cancel: (id: number) =>
      fetchApi<void>(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      }),
  },

  health: () => fetchApi<{ status: string }>('/health'),
};

export { ApiError };
