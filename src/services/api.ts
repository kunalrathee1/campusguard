const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('campusguard_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.message) errorMsg = data.message;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () => request<{ success: boolean; user: any }>('/auth/me'),
    forgotPassword: (email: string) =>
      request<{ success: boolean; message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },

  // Students
  students: {
    list: (params?: Record<string, string | number>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return request<{ success: boolean; data: any[]; pagination: any }>(`/students${query}`);
    },
    get: (id: string) => request<{ success: boolean; data: any }>(`/students/${id}`),
    create: (data: any) =>
      request<{ success: boolean; data: any }>('/students', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ success: boolean; data: any }>(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/students/${id}`, {
        method: 'DELETE',
      }),
    getRiskStats: () => request<{ success: boolean; stats: any }>('/students/risk-stats'),
  },

  // Attendance
  attendance: {
    mark: (payload: { subject: string; date?: string; records: { studentId: string; status: string }[] }) =>
      request<{ success: boolean; data: any[]; message: string }>('/attendance/mark', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getWeeklyTrend: () => request<{ success: boolean; data: any[] }>('/attendance/weekly-trend'),
    getRecords: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ success: boolean; data: any[] }>(`/attendance/records${query}`);
    },
  },

  // Warnings
  warnings: {
    list: (params?: Record<string, string | boolean>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return request<{ success: boolean; data: any[] }>(`/warnings${query}`);
    },
    create: (data: any) =>
      request<{ success: boolean; data: any }>('/warnings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    acknowledge: (id: string) =>
      request<{ success: boolean; data: any }>(`/warnings/${id}/acknowledge`, {
        method: 'PATCH',
      }),
    getTrends: () => request<{ success: boolean; data: any[] }>('/warnings/trends'),
  },

  // Classes
  classes: {
    list: (params?: Record<string, string | number>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return request<{ success: boolean; data: any[] }>(`/classes${query}`);
    },
    get: (id: string) => request<{ success: boolean; data: any }>(`/classes/${id}`),
  },

  // Notifications
  notifications: {
    list: () => request<{ success: boolean; data: any[]; unreadCount: number }>('/notifications'),
    markRead: (id: string) => request<{ success: boolean; data: any }>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request<{ success: boolean; message: string }>('/notifications/read-all', { method: 'POST' }),
  },

  // Analytics
  analytics: {
    overview: () => request<{ success: boolean; data: any }>('/analytics/overview'),
  },
};
