import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { AuthProvider } from '@/context/AuthContext';
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700"],
})

export const metadata = {
  title: 'FinChat - AI Mutual Fund Advisor',
  description: 'Get personalized mutual fund recommendations from 2000+ funds. Powered by Groq Llama 4 AI model. Educational tool for smart investing.',
  keywords: ['mutual funds', 'investment', 'recommendations', 'AI', 'MFAPI', 'India'],
  authors: [{ name: 'FinChat Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'FinChat - AI Mutual Fund Advisor',
    description: 'Get personalized mutual fund recommendations powered by AI',
    type: 'website',
    url: 'https://finchat.example.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%232563eb'>📊</text></svg>" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
