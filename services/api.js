import { API_BASE_URL } from '../config/api';

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      return data;
    } catch (error) {
      console.error('API 요청 에러:', error);
      throw error;
    }
  }

  // 인증 관련 API
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // 여행 관련 API
  async getTrips() {
    return this.request('/trips');
  }

  async getTrip(id) {
    return this.request(`/trips/${id}`);
  }

  async createTrip(tripData) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async updateTrip(id, tripData) {
    return this.request(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(id) {
    return this.request(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  // 지출 관련 API
  async addExpense(tripId, expenseData) {
    return this.request(`/trips/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async updateExpense(tripId, expenseId, expenseData) {
    return this.request(`/trips/${tripId}/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  }

  async deleteExpense(tripId, expenseId) {
    return this.request(`/trips/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
