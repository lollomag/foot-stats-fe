'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const customLabels: Record<string, string> = {
  tornei: 'Tornei',
  profilo: 'Profilo',
  giocatori: 'Giocatori',
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Suddividi il percorso in segmenti
  const segments = pathname.split('/').filter((segment) => segment);

  return (
    <nav className="container max-w-screen-2xl mx-auto px-4 lg:px-8 py-4 flex items-center space-x-2 text-gray-600 text-sm">
      <div>
        <Link href="/" className="text-blue-500 hover:underline">
          Home
        </Link>
      </div>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const label = customLabels[segment] || segment.replace(/-/g, ' ').toUpperCase();
        
        if (label === "GIOCATORE") {
          return
        }

        return (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {isLast ? (
              <span className="font-medium">{label}</span>
            ) : (
              <Link href={href} className="text-blue-500 hover:underline">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
