// Mock authentication utility
export const mockAuth = {
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken') !== null;
    }
    return false;
  },
  
  login: (credentials) => {
    const { mockAdminUser } = require('@/data/mock-data');
    
    if (credentials.username === mockAdminUser.username && 
        credentials.password === mockAdminUser.password) {
      localStorage.setItem('adminToken', 'mock-jwt-token');
      return { success: true, user: { username: mockAdminUser.username } };
    }
    
    return { success: false, error: 'Invalid credentials' };
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
  },
  
  getUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        return { username: 'admin' };
      }
    }
    return null;
  }
};