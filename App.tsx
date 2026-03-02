import React, { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import type { User } from './types';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('algoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    // Validate existing token on app load
    const validateToken = async () => {
      try {
        await apiService.verifyToken();
      } catch (e) {
        // Token invalid or expired — clear and force re-auth
        localStorage.removeItem('algoUser');
        localStorage.removeItem('algoToken');
        localStorage.removeItem('quizHistory');
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, []);

  const handleLogin = useCallback((loggedInUser: User) => {
    localStorage.setItem('algoUser', JSON.stringify(loggedInUser));
    // Simulate JWT token
    // Note: token is set by apiService upon successful login/signup
    setUser(loggedInUser);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    // Ensure apiService clears token too
    try { apiService.logout(); } catch {}
    localStorage.removeItem('algoUser');
    localStorage.removeItem('algoToken');
    localStorage.removeItem('quizHistory');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {isAuthenticated && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;