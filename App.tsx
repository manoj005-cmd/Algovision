import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import type { User } from './types';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User>(() => ({
    name: 'Guest',
    studentId: 'N/A',
    phone: 'N/A',
    email: 'guest@sode-edu.in',
  }));

  const handleLogout = useCallback(() => {
    // Ensure apiService clears token too
    try { apiService.logout(); } catch {}
    localStorage.removeItem('algoUser');
    localStorage.removeItem('algoToken');
    localStorage.removeItem('quizHistory');
    setUser({
      name: 'Guest',
      studentId: 'N/A',
      phone: 'N/A',
      email: 'guest@sode-edu.in',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  );
};

export default App;