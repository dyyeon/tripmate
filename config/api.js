// API 설정 파일
// 개발 환경에서는 로컬 IP 주소를 사용해야 합니다.

// 로컬 개발 서버 주소 (실제 IP 주소로 변경 필요)
export const API_BASE_URL = 'http://192.168.1.100:3000/api'; // 실제 IP로 변경하세요

// 개발 환경 감지
export const isDevelopment = __DEV__;

// 네트워크 설정
export const networkConfig = {
  timeout: 10000, // 10초
  retries: 3,
};

// API 엔드포인트
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  trips: {
    list: '/trips',
    create: '/trips',
    get: (id) => `/trips/${id}`,
    update: (id) => `/trips/${id}`,
    delete: (id) => `/trips/${id}`,
    addExpense: (id) => `/trips/${id}/expenses`,
    updateExpense: (tripId, expenseId) => `/trips/${tripId}/expenses/${expenseId}`,
    deleteExpense: (tripId, expenseId) => `/trips/${tripId}/expenses/${expenseId}`,
  },
};
