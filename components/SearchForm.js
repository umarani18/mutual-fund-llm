'use client';

import { useState } from 'react';

export default function SearchForm({ onSearch, loading }) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (prompt.trim().length < 10) {
      setError('Please enter at least 10 characters in your query');
      return;
    }

    onSearch(prompt.trim());
  };

  const suggestions = [
    "I want to invest ₹5 lakhs for my child's education in 10 years",
    "Looking for safe options for emergency fund, I'm conservative",
    "Aggressive growth strategy, I'm young with a 30-year horizon",
    "Need balanced growth and income for retirement planning",
  ];

  return (
    <div className="space-y-6">
      {/* Main Search Box */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError('');
            }}
            placeholder="Describe your investment goals... e.g., 'I want to invest ₹5 lakhs for long-term growth with moderate risk'"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-gray-900 placeholder-gray-400 transition"
            rows="4"
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-400">
            {prompt.length}/500
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm flex items-center space-x-1">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading || prompt.trim().length < 10}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
            loading || prompt.trim().length < 10
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Analyzing Funds...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Get Top 10 Recommendations</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Suggestions */}
      <div>
        <p className="text-sm text-gray-600 mb-3 font-medium">💡 Quick Examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(suggestion);
                setError('');
              }}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-sm text-gray-700 hover:text-gray-900"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-medium mb-2">✨ Pro Tips:</p>
        <ul className="space-y-1 text-xs text-blue-800">
          <li>• Be specific about your investment amount and timeline</li>
          <li>• Mention your risk tolerance (conservative, moderate, aggressive)</li>
          <li>• Describe your financial goals clearly</li>
          <li>• The more details you provide, the better the recommendations</li>
        </ul>
      </div>
    </div>
  );
}
