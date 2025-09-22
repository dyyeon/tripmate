import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './api';

const TOKEN_KEY = 'tripmate_token';
const USER_KEY = 'tripmate_user';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiService.login({ email, password });
      
      // 토큰과 사용자 정보 저장
      await this.setToken(response.token);
      await this.setUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const response = await apiService.register({ name, email, password });
      
      // 토큰과 사용자 정보 저장
      await this.setToken(response.token);
      await this.setUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      apiService.setToken(null);
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  }

  async setToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      apiService.setToken(token);
    } catch (error) {
      console.error('토큰 저장 에러:', error);
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('토큰 조회 에러:', error);
      return null;
    }
  }

  async setUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('사용자 정보 저장 에러:', error);
    }
  }

  async getUser() {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('사용자 정보 조회 에러:', error);
      return null;
    }
  }

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  async initializeAuth() {
    try {
      const token = await this.getToken();
      if (token) {
        apiService.setToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('인증 초기화 에러:', error);
      return false;
    }
  }
}

export default new AuthService();
