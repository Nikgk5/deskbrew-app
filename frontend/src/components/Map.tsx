"use client";

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import MapboxMap, { 
  Marker, 
  NavigationControl, 
  GeolocateControl,
  MapRef,
  ViewStateChangeEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Coffee, Star } from 'lucide-react';
import { Cafe } from '@/lib/api';

interface MapProps {
  cafes: Cafe[];
  activeCafeId: number | null;
  onCafeHover: (id: number | null) => void;
  onBoundsChange: (bounds: { sw_lat: number, sw_lng: number, ne_lat: number, ne_lng: number }) => void;
  onMarkerClick?: (id: number) => void;
  flyToLocation?: { lat: number; lng: number } | null;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Custom minimalist style matching Apple Maps aesthetic (or close enough using a Mapbox Light style)
const MAP_STYLE = "mapbox://styles/mapbox/light-v11"; 

export default function Map({ cafes, activeCafeId, onCafeHover, onBoundsChange, onMarkerClick, flyToLocation }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 13.4050, // Berlin
    latitude: 52.5200,
    zoom: 13,
    pitch: 45,
    bearing: 0
  });

  useEffect(() => {
    if (flyToLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [flyToLocation.lng, flyToLocation.lat],
        zoom: 15,
        duration: 1500
      });
    }
  }, [flyToLocation]);

  const handleMoveEnd = useCallback((e: ViewStateChangeEvent) => {
    setViewState(e.viewState);
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        onBoundsChange({
          sw_lat: bounds.getSouth(),
          sw_lng: bounds.getWest(),
          ne_lat: bounds.getNorth(),
          ne_lng: bounds.getEast(),
        });
      }
    }
  }, [onBoundsChange]);

  const pins = useMemo(() => {
    return cafes.map((cafe) => {
      const isActive = activeCafeId === cafe.id;
      return (
        <Marker
          key={cafe.id}
          longitude={cafe.longitude}
          latitude={cafe.latitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            onMarkerClick?.(cafe.id);
          }}
        >
          <div 
            className={`
              relative cursor-pointer group transition-all duration-300 ease-out
              ${isActive ? 'scale-110 z-50' : 'scale-100 z-10 hover:z-40 hover:scale-105'}
            `}
            onMouseEnter={() => onCafeHover(cafe.id)}
            onMouseLeave={() => onCafeHover(null)}
          >
            {/* The Pin */}
            {isActive ? (
              <div className="flex flex-col items-center">
                {/* Custom Active Pop-up */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex items-center bg-white rounded-2xl shadow-xl p-1.5 pr-4 border border-orange-100/50 whitespace-nowrap min-w-max z-50">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 shrink-0 bg-gray-100">
                    {cafe.image_url ? (
                      <img src={cafe.image_url} alt={cafe.name} className="object-cover w-full h-full" />
                    ) : (
                      <Coffee className="w-5 h-5 m-2 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-gray-900">{cafe.name}</span>
                      <Star className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      {cafe.scores.wifi_speed.toFixed(1)} Mbps • <span className="text-emerald-700">{cafe.desks_available} seats left</span>
                    </div>
                  </div>
                </div>

                {/* The Active Marker */}
                <div className="relative flex items-center justify-center bg-[#7B3B1B] text-white w-12 h-12 rounded-full border-[3px] border-orange-500 shadow-md font-bold z-40 text-sm">
                  {cafe.scores.overall.toFixed(1)}
                  <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-[#7B3B1B]"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-full border-2 border-white shadow-md font-bold bg-gray-900 text-white w-10 h-10">
                <Coffee className="w-5 h-5" />
              </div>
            )}
            
            {/* Mini Tooltip that appears on hover (if not active card) */}
            {!isActive && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-3 py-2 rounded-xl shadow-xl border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="font-bold text-sm">{cafe.name}</div>
                <div className="text-xs text-gray-500">{cafe.scores.wifi_speed.toFixed(1)} Mbps • {cafe.desks_available} desks</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        </Marker>
      );
    });
  }, [cafes, activeCafeId, onCafeHover, onMarkerClick]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-mapGreen/20 rounded-3xl text-gray-500">
        Mapbox token is missing in .env.local
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 pl-0">
      <div className="w-full h-full rounded-[24px] overflow-hidden shadow-sm border border-gray-200/50 relative">
        <MapboxMap
          ref={mapRef}
          {...viewState}
          onMove={e => setViewState(e.viewState)}
          onMoveEnd={handleMoveEnd}
          mapStyle={MAP_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
        >
          <GeolocateControl position="bottom-right" />
          <NavigationControl position="bottom-right" showCompass={true} />
          {pins}
        </MapboxMap>
        
        {/* Floating Controls matching Apple aesthetic */}
        <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-gray-100 px-4 py-2 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input type="checkbox" className="accent-primary" defaultChecked />
            Search as I move the map
          </label>
        </div>

        <div className="absolute top-6 right-6 z-10 flex bg-white/90 backdrop-blur-md rounded-full shadow-md border border-gray-100 p-1">
          <button className="px-4 py-1.5 text-sm font-semibold bg-gray-900 text-white rounded-full">Map</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full">Satellite</button>
        </div>
      </div>
    </div>
  );
}
