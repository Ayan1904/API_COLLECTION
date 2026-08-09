'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ApiDetailsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
    </div>
  );
}