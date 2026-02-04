import './globals.css'

export const metadata = {
  title: 'FinChat - AI Mutual Fund Advisor',
  description: 'Get personalized mutual fund recommendations from 2000+ funds. Powered by Groq Llama 4 AI model. Educational tool for smart investing.',
  keywords: ['mutual funds', 'investment', 'recommendations', 'AI', 'MFAPI', 'India'],
  authors: [{ name: 'FinChat Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
  openGraph: {
    title: 'FinChat - AI Mutual Fund Advisor',
    description: 'Get personalized mutual fund recommendations powered by AI',
    type: 'website',
    url: 'https://finchat.example.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%232563eb'>📊</text></svg>" />
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {children}
      </body>
    </html>
  )
}
