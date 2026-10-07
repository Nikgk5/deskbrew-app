"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Compass, Bell, User } from 'lucide-react';
import Map from '@/components/Map';
import CafeCard from '@/components/CafeCard';
import { fetchAllCafes, Cafe } from '@/lib/api';

export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCafeId, setActiveCafeId] = useState<number | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleMarkerClick = (id: number) => {
    setActiveCafeId(id);
    const element = document.getElementById(`cafe-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCardClick = (cafe: Cafe) => {
    setActiveCafeId(cafe.id);
    setFlyToLocation({ lat: cafe.latitude, lng: cafe.longitude });
  };
  
  // Default bounds around Berlin Mitte
  const [bounds, setBounds] = useState({
    sw_lat: 52.48, sw_lng: 13.35, ne_lat: 52.55, ne_lng: 13.46
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadCafes = async () => {
      setLoading(true);
      try {
        const data = await fetchAllCafes();
        if (isMounted) {
          setCafes(data.cafes);
        }
      } catch (error) {
        console.error("Failed to load cafes:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCafes();
    
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image 
              src="/icon.png" 
              alt="DeskBrew Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[22px] tracking-tight text-[#5a514b]">
            <span className="font-semibold">DESK</span><span className="font-extrabold">BREW</span>
          </span>
        </div>
        
        {/* Search and Nav removed for simplicity */}
      </header>

      {/* Main Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (45%) */}
        <section className="w-[45%] h-full flex flex-col bg-background z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Filters Bar */}
          <div className="px-6 py-5 shrink-0 bg-background/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {loading ? '...' : cafes.length} work-friendly spots available in this area
              </h2>
            </div>
            
            {/* Filters and sort removed */}
          </div>

          {/* Scrollable Cafe List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 pb-24 relative">
            {loading ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-[450px] w-full shadow-sm border border-gray-100"></div>
                ))}
              </div>
            ) : cafes.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No cafes found in this area. Try moving the map!
              </div>
            ) : (
              <div className="flex flex-col">
                {cafes.map(cafe => (
                  <CafeCard 
                    key={cafe.id} 
                    cafe={cafe} 
                    isActive={activeCafeId === cafe.id}
                    onHover={setActiveCafeId}
                    onClick={() => handleCardClick(cafe)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Map Panel (55%) */}
        <section className="w-[55%] h-full bg-mapWater">
          <Map 
            cafes={cafes} 
            activeCafeId={activeCafeId} 
            onCafeHover={setActiveCafeId}
            onBoundsChange={setBounds}
            onMarkerClick={handleMarkerClick}
            flyToLocation={flyToLocation}
          />
        </section>
      </main>
    </div>
  );
}
