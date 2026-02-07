'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [router, isAuthenticated, loading]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse">
      Initialing Secure Session...
    </div>
  );
}
