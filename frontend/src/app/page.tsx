"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Compass, Bell, User, GripVertical } from 'lucide-react';
import Map from '@/components/Map';
import CafeCard from '@/components/CafeCard';
import { fetchAllCafes, Cafe } from '@/lib/api';

export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCafeId, setActiveCafeId] = useState<number | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Resizer state
  const [sidebarWidth, setSidebarWidth] = useState(45);
  const [isDragging, setIsDragging] = useState(false);

  const handleMarkerClick = (id: number) => {
    setActiveCafeId(id);
    const cafe = cafes.find(c => c.id === id);
    if (cafe) {
      setFlyToLocation({ lat: cafe.latitude, lng: cafe.longitude });
    }
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

  // Handle Dragging to Resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        setSidebarWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      // Disable text selection globally while dragging
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

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
    <div className="flex flex-col h-screen bg-canvas-gray overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-surface border-b border-surface-container-highest flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image 
              src="/icon.png" 
              alt="DeskBrew Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[22px] tracking-tight text-primary">
            <span className="font-semibold">DESK</span><span className="font-extrabold">BREW</span>
          </span>
        </div>
      </header>

      {/* Main Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <section 
          style={{ width: `${sidebarWidth}%` }}
          className="h-full flex flex-col bg-canvas-gray z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0"
        >
          {/* Filters Bar */}
          <div className="px-6 py-5 shrink-0 bg-canvas-gray/90 backdrop-blur-xl border-b border-surface-container-highest sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-neutral flex items-center gap-2 tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                {loading ? '...' : cafes.length} work-friendly spots available
              </h2>
            </div>
          </div>

          {/* Scrollable Cafe List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 relative">
            {loading ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-surface rounded-3xl h-[450px] w-full shadow-level-1 border border-neutral/5"></div>
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

        {/* Draggable Divider */}
        <div 
          className="w-1 hover:w-1.5 hover:bg-secondary bg-surface-container-highest cursor-col-resize z-30 transition-all flex items-center justify-center shrink-0"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="bg-surface border border-outline-variant rounded-full shadow-sm p-0.5 pointer-events-none absolute z-40">
            <GripVertical className="w-3 h-3 text-outline" />
          </div>
        </div>

        {/* Right Map Panel */}
        <section 
          style={{ width: `calc(${100 - sidebarWidth}% - 4px)` }}
          className="h-full bg-mapWater grow relative"
        >
          {/* Floating Island Search */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 glass-panel rounded-full px-4 py-2 flex items-center gap-4">
             <div className="flex items-center text-sm font-semibold text-neutral border-r border-neutral/10 pr-4">
                Berlin Mitte
             </div>
             <div className="flex items-center text-sm font-semibold text-on-surface-variant border-r border-neutral/10 pr-4">
                Speed: 100+ Mbps
             </div>
             <div className="flex items-center text-sm font-semibold text-on-surface-variant pr-2">
                Quiet Focus
             </div>
             <div className="bg-primary hover:bg-primary-container text-on-primary w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md">
                <Search className="w-4 h-4" />
             </div>
          </div>
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
