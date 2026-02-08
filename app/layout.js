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
  title: 'Mutual Fund Research Tool',
  description: 'Learn about mutual funds and financial patterns through our AI educational simulator. For research and learning purposes only.',
  keywords: ['mutual funds', 'learning', 'educational', 'AI', 'simulation'],
  authors: [{ name: 'Research Tool Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Mutual Fund Research Tool',
    description: 'Learn about mutual funds and financial patterns through our AI educational simulator',
    type: 'website',
    url: 'https://researchtool.example.com',
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
