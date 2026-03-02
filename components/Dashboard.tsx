import React, { useState } from 'react';
import Visualization from './Visualization';
import Quiz from './Quiz';
import { Export } from './Export';
import ComplexityAnalyzer from './ComplexityAnalyzer';
import type { User } from '../types';
import { apiService } from '../services/apiService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type View = 'dashboard' | 'visualizer' | 'quiz' | 'export' | 'analyzer';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleLogout = () => {
    apiService.logout();
    onLogout();
  };

  const renderView = () => {
    switch (currentView) {
      case 'visualizer':
        return <Visualization />;
      case 'quiz':
        return <Quiz />;
      case 'export':
        return <Export user={user} />;
      case 'analyzer':
        return <ComplexityAnalyzer />;
      default:
        return <DashboardHome setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/30 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => setCurrentView('dashboard')} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                AlgoVision
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 hidden sm:block" title={user.email}>{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {currentView !== 'dashboard' && (
          <button
            onClick={() => setCurrentView('dashboard')}
            className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
          >
            &larr; Back to Dashboard
          </button>
        )}
        {renderView()}
      </main>
    </div>
  );
};

const DashboardHome: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  const features = [
    { title: 'Algorithm Visualizer', description: 'Watch sorting and searching algorithms in action.', view: 'visualizer', icon: '🎬' },
    { title: 'Complexity Analyzer', description: 'Compare algorithm performance on your own data.', view: 'analyzer', icon: '📈' },
    { title: 'Interactive Quiz', description: 'Test your knowledge on data structures and algorithms.', view: 'quiz', icon: '📝' },
    { title: 'Export Report', description: 'Download a summary of your learning progress.', view: 'export', icon: '📥' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.view}
            onClick={() => setView(feature.view as View)}
            className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/50 hover:border-indigo-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group hover:shadow-xl hover:shadow-indigo-500/20"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-gray-400 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
