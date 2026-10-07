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
  const [activeType, setActiveType] = useState<'all' | 'cafe' | 'workspace'>('all');
  
  const [sidebarWidth, setSidebarWidth] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile Bottom Sheet State
  const [mobileSheetHeight, setMobileSheetHeight] = useState(55); // vh
  const [isMobileDragging, setIsMobileDragging] = useState(false);

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsMobileDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobileDragging) return;
    const touchY = e.touches[0].clientY;
    const vh = window.innerHeight;
    const newHeight = ((vh - touchY) / vh) * 100;
    
    if (newHeight >= 15 && newHeight <= 95) {
      setMobileSheetHeight(newHeight);
    }
  };

  const handleTouchEnd = () => {
    setIsMobileDragging(false);
    // Snap points
    if (mobileSheetHeight < 30) setMobileSheetHeight(20);
    else if (mobileSheetHeight > 75) setMobileSheetHeight(82);
    else setMobileSheetHeight(55);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMobileDragging(true);
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isMobileDragging) return;
      const vh = window.innerHeight;
      const newHeight = ((vh - e.clientY) / vh) * 100;
      if (newHeight >= 15 && newHeight <= 95) {
        setMobileSheetHeight(newHeight);
      }
    };
    
    const handleWindowMouseUp = () => {
      if (isMobileDragging) {
        setIsMobileDragging(false);
        if (mobileSheetHeight < 30) setMobileSheetHeight(20);
        else if (mobileSheetHeight > 75) setMobileSheetHeight(82);
        else setMobileSheetHeight(55);
      }
    };

    if (isMobileDragging && window.innerWidth < 1024) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      if (window.innerWidth < 1024) document.body.style.userSelect = 'auto';
    };
  }, [isMobileDragging, mobileSheetHeight]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="flex flex-col h-[100dvh] bg-canvas-gray overflow-hidden overscroll-none">
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
          <span className="text-3xl text-primary font-bungee">
            DESKBREW
          </span>
        </div>
      </header>

      {/* Main Split Screen */}
      <main 
        className="flex-1 flex overflow-hidden relative flex-col lg:flex-row"
        style={{ 
          '--sidebar-width': `${sidebarWidth}%`,
          '--map-width': `calc(${100 - sidebarWidth}% - 4px)`,
          '--mobile-sheet-height': `${mobileSheetHeight}vh`
        } as React.CSSProperties}
      >
        {/* Right Map Panel (Full screen on mobile, right side on desktop) */}
        <section 
          className="absolute inset-0 z-0 lg:relative lg:h-full bg-mapWater grow w-full lg:w-[var(--map-width)]"
        >
          <Map 
            cafes={cafes.filter(c => activeType === 'all' || c.type === activeType)} 
            activeCafeId={activeCafeId} 
            onCafeHover={setActiveCafeId}
            onBoundsChange={setBounds}
            onMarkerClick={handleMarkerClick}
            flyToLocation={flyToLocation}
          />
        </section>

        {/* Left Sidebar (Bottom Sheet on Mobile) */}
        <section 
          style={{ transition: isMobileDragging ? 'none' : 'height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          className="absolute bottom-0 left-0 w-full lg:w-[var(--sidebar-width)] h-[var(--mobile-sheet-height)] lg:h-full rounded-t-[2rem] flex flex-col bg-canvas-gray z-30 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] lg:relative lg:rounded-none lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shrink-0 lg:order-first"
        >
          {/* Mobile Handle */}
          <div 
            className="w-full flex justify-center py-3 lg:hidden shrink-0 bg-canvas-gray/90 backdrop-blur-xl rounded-t-[2rem] active:bg-surface-dim touch-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className="w-12 h-1.5 bg-outline-variant rounded-full"></div>
          </div>

          {/* Filters Bar */}
          <div className="px-6 pb-4 pt-1 lg:pt-5 shrink-0 bg-canvas-gray/90 backdrop-blur-xl border-b border-surface-container-highest sticky top-0 z-20 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-neutral flex items-center gap-2 tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                {loading ? '...' : cafes.length} work-friendly spots
              </h2>
              {mobileSheetHeight > 65 && (
                <button 
                  onClick={() => setMobileSheetHeight(45)}
                  className="lg:hidden text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/20 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Show Map
                </button>
              )}
            </div>
            
            {/* Type Toggle */}
            <div className="flex bg-surface-container-highest p-1 rounded-xl">
              <button 
                onClick={() => setActiveType('all')}
                className={`flex-1 text-sm font-semibold py-1.5 rounded-lg transition-colors ${activeType === 'all' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-neutral'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveType('cafe')}
                className={`flex-1 text-sm font-semibold py-1.5 rounded-lg transition-colors ${activeType === 'cafe' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-neutral'}`}
              >
                Cafes
              </button>
              <button 
                onClick={() => setActiveType('workspace')}
                className={`flex-1 text-sm font-semibold py-1.5 rounded-lg transition-colors ${activeType === 'workspace' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-neutral'}`}
              >
                Workspaces
              </button>
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
                {cafes.filter(c => activeType === 'all' || c.type === activeType).map(cafe => (
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

        {/* Draggable Divider (Desktop Only) */}
        <div 
          className="hidden w-1 hover:w-1.5 hover:bg-secondary bg-surface-container-highest cursor-col-resize z-30 transition-all lg:flex items-center justify-center shrink-0 order-none"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="bg-surface border border-outline-variant rounded-full shadow-sm p-0.5 pointer-events-none absolute z-40">
            <GripVertical className="w-3 h-3 text-outline" />
          </div>
        </div>
      </main>
    </div>
  );
}
