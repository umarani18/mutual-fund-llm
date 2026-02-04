'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and branding */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition">
              <span className="text-white text-2xl font-bold">📊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FinChat
              </h1>
              <p className="text-xs text-gray-500 font-medium">AI Mutual Fund Advisor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              How It Works
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              About Funds
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Disclaimer
            </a>
          </nav>

          {/* Stats Badge */}
          <div className="hidden lg:flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1 text-gray-600">
              <span className="text-lg">📈</span>
              <span>2000+ Funds</span>
            </span>
            <span className="w-1 h-4 bg-gray-300"></span>
            <span className="flex items-center space-x-1 text-gray-600">
              <span className="text-lg">⚡</span>
              <span>Instant Results</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
