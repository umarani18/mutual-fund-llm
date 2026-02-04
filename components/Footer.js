'use client';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-bold text-white text-lg">FinChat</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered mutual fund advisor analyzing 2000+ funds to help you make informed investment decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Fund Types</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Data Source */}
          <div>
            <h4 className="font-semibold text-white mb-4">Data & Technology</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                <span className="font-medium">Funds:</span> MFAPI
              </li>
              <li className="text-gray-400">
                <span className="font-medium">AI Model:</span> Groq Llama 4
              </li>
              <li className="text-gray-400">
                <span className="font-medium">Database:</span> 2000+ Funds
              </li>
              <li className="text-gray-400">
                <span className="font-medium">Updates:</span> Real-time
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Disclaimer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Terms of Use</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Disclosure</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2026 FinChat - AI-Powered Mutual Fund Advisory. Educational Tool Only.
          </p>
          
          {/* Social Links (placeholder) */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">Follow us:</span>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-blue-400 transition">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 p-4 bg-red-950/20 border border-red-900/30 rounded-lg">
          <p className="text-xs text-red-300">
            <span className="font-semibold">⚠️ Important:</span> This tool is for educational purposes only. 
            Not financial advice. Please consult with a SEBI-registered investment professional before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}
