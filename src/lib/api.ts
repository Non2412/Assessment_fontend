// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Generic fetch helper
export async function apiCall<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Assessment endpoints
export const assessmentAPI = {
  getAll: () => apiCall('/assessments'),
  getById: (id: string) => apiCall(`/assessments/${id}`),
  getByStatus: (status: string) => apiCall(`/assessments?status=${status}`),
  create: (data: any) => apiCall('/assessments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/assessments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/assessments/${id}`, {
    method: 'DELETE',
  }),
};

// Result endpoints
export const resultAPI = {
  getAll: () => apiCall('/results'),
  getById: (id: string) => apiCall(`/results/${id}`),
  create: (data: any) => apiCall('/results', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall(`/results/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall(`/results/${id}`, {
    method: 'DELETE',
  }),
};
