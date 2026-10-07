import React from 'react';
import Image from 'next/image';
import { Wifi, Plug, Volume2, Star, MapPin } from 'lucide-react';
import { Cafe } from '@/lib/api';

interface CafeCardProps {
  cafe: Cafe;
  onHover?: (id: number | null) => void;
  isActive?: boolean;
}

export default function CafeCard({ cafe, onHover, isActive }: CafeCardProps) {
  return (
    <div 
      id={`cafe-${cafe.id}`}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-floating transition-all duration-300 border border-gray-100 ${isActive ? 'ring-2 ring-primary' : ''} mb-6`}
      onMouseEnter={() => onHover?.(cafe.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image Header */}
      <div className="relative h-56 w-full">
        {cafe.image_url ? (
          <Image 
            src={cafe.image_url} 
            alt={cafe.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {/* Nomad score badge removed */}
        </div>
        
        {/* Availability Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-gray-900/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cafe.desks_available > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            {cafe.desks_available > 0 ? `${cafe.desks_available} desks available` : 'At capacity'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{cafe.name}</h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-5">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{cafe.address}</span>
          {cafe.distance_label && (
            <>
              <span className="mx-1.5">•</span>
              <span>{cafe.distance_label}</span>
            </>
          )}
        </div>

        {/* Metric Pills */}
        <div className="flex gap-3 mb-5 overflow-x-auto pb-1 hide-scrollbar">
          <div className="flex items-center gap-2 bg-blue-50/50 text-blue-900 px-3 py-2 rounded-xl flex-shrink-0">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Wifi className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-600/70 tracking-wider">WiFi Speed</div>
              <div className="font-semibold text-sm">{cafe.scores.wifi_speed.toFixed(1)} <span className="text-blue-900/40 font-normal">/ 10</span></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50/50 text-orange-900 px-3 py-2 rounded-xl flex-shrink-0">
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <Plug className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-orange-600/70 tracking-wider">Power Plugs</div>
              <div className="font-semibold text-sm">{cafe.scores.power_outlets.toFixed(1)} <span className="text-orange-900/40 font-normal">/ 10</span></div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 text-gray-900 px-3 py-2 rounded-xl flex-shrink-0">
            <div className="bg-gray-200 p-1.5 rounded-lg">
              <Volume2 className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Quietness</div>
              <div className="font-semibold text-sm">{cafe.scores.quietness.toFixed(1)} <span className="text-gray-400 font-normal">/ 10</span></div>
            </div>
          </div>
        </div>

        {/* Description */}
        {cafe.ai_insight && (
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-gray-900 font-bold text-sm">Description</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {cafe.ai_insight}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
            <span className="font-semibold text-gray-900">{cafe.price_level}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="truncate max-w-[150px]">{cafe.specialty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
