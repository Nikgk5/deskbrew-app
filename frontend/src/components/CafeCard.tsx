import React from 'react';
import Image from 'next/image';
import { Wifi, Plug, Volume2, MapPin } from 'lucide-react';
import { Cafe } from '@/lib/api';

interface CafeCardProps {
  cafe: Cafe;
  onHover?: (id: number | null) => void;
  onClick?: () => void;
  isActive?: boolean;
}

export default function CafeCard({ cafe, onHover, onClick, isActive }: CafeCardProps) {
  return (
    <div 
      id={`cafe-${cafe.id}`}
      className={`bg-surface rounded-3xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all duration-300 border border-neutral/5 ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''} mb-6 cursor-pointer`}
      onMouseEnter={() => onHover?.(cafe.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={onClick}
    >
      {/* Image Header */}
      <div className="relative h-56 w-full p-2 pb-0">
        <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
          {cafe.image_url ? (
            <Image 
              src={cafe.image_url} 
              alt={cafe.name} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ) : (
            <div className="w-full h-full bg-surface-dim flex items-center justify-center text-on-surface-variant font-medium">No Image</div>
          )}
          
          {/* Availability Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-neutral/90 backdrop-blur-md text-surface text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className={`w-2 h-2 rounded-full ${cafe.desks_available > 0 ? 'bg-emerald-400' : 'bg-error text-on-error'}`}></span>
              {cafe.desks_available > 0 ? `${cafe.desks_available} desks available` : 'At capacity'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[24px] font-bold text-neutral leading-tight tracking-tight">{cafe.name}</h3>
        </div>
        
        <div className="flex items-center text-on-surface-variant text-sm mb-5 font-medium tracking-wide">
          <MapPin className="w-4 h-4 mr-1 text-outline" />
          <span>{cafe.address}</span>
          {cafe.distance_label && (
            <>
              <span className="mx-1.5 text-outline-variant">•</span>
              <span>{cafe.distance_label}</span>
            </>
          )}
        </div>

        {/* Metric Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 hide-scrollbar">
          {/* WiFi Score */}
          <div className="flex items-center gap-1.5 bg-wifi-bg text-wifi-text border border-wifi-text/20 px-3 py-1.5 rounded-full flex-shrink-0">
            <Wifi className="w-3.5 h-3.5" />
            <div className="font-semibold text-xs tracking-wide">
              {cafe.scores.wifi_speed > 8 ? 'High-Speed' : 'Moderate'} <span className="opacity-70 ml-0.5">{cafe.scores.wifi_speed.toFixed(1)}/10</span>
            </div>
          </div>
          
          {/* Power Plugs */}
          <div className="flex items-center gap-1.5 bg-power-bg text-power-text border border-power-text/20 px-3 py-1.5 rounded-full flex-shrink-0">
            <Plug className="w-3.5 h-3.5" />
            <div className="font-semibold text-xs tracking-wide">
              {cafe.scores.power_outlets > 7 ? 'Plentiful Plugs' : 'Limited Plugs'} <span className="opacity-70 ml-0.5">{cafe.scores.power_outlets.toFixed(1)}/10</span>
            </div>
          </div>

          {/* Quietness */}
          <div className="flex items-center gap-1.5 bg-noise-bg text-noise-text border border-noise-text/20 px-3 py-1.5 rounded-full flex-shrink-0">
            <Volume2 className="w-3.5 h-3.5" />
            <div className="font-semibold text-xs tracking-wide">
              {cafe.scores.quietness > 7 ? 'Quiet Focus' : 'Bustling'} <span className="opacity-70 ml-0.5">{cafe.scores.quietness.toFixed(1)}/10</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {cafe.ai_insight && (
          <div className="mb-5">
            <p className="text-[14px] text-on-surface-variant leading-[24px]">
              {cafe.ai_insight}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-container-highest">
          <div className="text-sm font-semibold flex items-center gap-2">
            <span className="text-primary bg-primary-fixed px-2 py-0.5 rounded-md">{cafe.price_level}</span>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
            <span className="text-on-surface-variant truncate max-w-[150px]">{cafe.specialty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
