'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./GameMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-64px)] w-full bg-map-water flex items-center justify-center text-white animate-pulse">
      Loading Expedition Map...
    </div>
  ),
});

export default function MapWrapper() {
  return <Map />;
}
