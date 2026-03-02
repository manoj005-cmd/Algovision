
import React, { useState } from 'react';
import { getLowLatencyResponse } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I'm your AI assistant. Ask me anything about the algorithms you see here!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getLowLatencyResponse(`In the context of algorithm visualization (like for Quick Sort, Merge Sort, Binary Search), briefly explain: "${input}"`);
      const aiMessage: Message = { text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { text: 'Sorry, I encountered an error. Please try again.', sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[70vh] bg-gray-800/50 rounded-lg border border-gray-700 shadow-xl">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">AI Algorithm Assistant</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl bg-gray-700 text-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Explain what a 'pivot' is..."
            className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
