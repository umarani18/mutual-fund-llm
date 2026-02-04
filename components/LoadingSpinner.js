'use client';

export default function LoadingSpinner({ size = 'large' }) {
  if (size === 'small') {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 rounded-full border-[6px] border-indigo-50 shadow-inner"></div>
        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-indigo-600 border-r-violet-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
          💎
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Analyzing</h3>
        <p className="text-gray-500 text-sm max-w-[280px] mx-auto leading-relaxed font-medium">
          Our AI is processing data points to find your optimal portfolio.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center space-y-4">
        <div className="h-1.5 w-48 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="flex space-x-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            <span>Fetching</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            <span>Parsing</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
            <span>Finalizing</span>
          </span>
        </div>
      </div>
    </div>
  );
}
