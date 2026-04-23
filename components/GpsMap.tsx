
import React from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Navigation } from 'lucide-react';

interface GpsMapProps {
  clientLoc?: { lat: number, lng: number };
  driverLoc?: { lat: number, lng: number };
  destinationLoc?: { lat: number, lng: number };
  zoom?: number;
  height?: string;
}

const GpsMap: React.FC<GpsMapProps> = ({ 
  clientLoc, 
  driverLoc, 
  destinationLoc, 
  zoom = 13, 
  height = '300px' 
}) => {
  // Center map on client, then driver, then Libreville fallback
  const center: [number, number] = clientLoc 
    ? [clientLoc.lat, clientLoc.lng] 
    : (driverLoc ? [driverLoc.lat, driverLoc.lng] : [0.3908, 9.4534]);

  return (
    <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative bg-slate-100" style={{ height }}>
      <Map 
        defaultCenter={center} 
        defaultZoom={zoom}
        metaWheelZoom={true}
      >
        {clientLoc && (
          <Marker 
            width={40}
            anchor={[clientLoc.lat, clientLoc.lng]} 
          >
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping absolute -inset-0"></div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white relative z-10">
                <div className="text-[10px] font-black">MOI</div>
              </div>
            </div>
          </Marker>
        )}

        {driverLoc && (
          <Marker 
            width={40}
            anchor={[driverLoc.lat, driverLoc.lng]} 
          >
            <div className="relative">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full animate-ping absolute -inset-0"></div>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white relative z-10">
                <span className="text-lg">🚕</span>
              </div>
            </div>
          </Marker>
        )}

        {destinationLoc && (
          <Marker 
            width={40}
            anchor={[destinationLoc.lat, destinationLoc.lng]} 
          >
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
              <Navigation className="w-3 h-3 fill-current rotate-45" />
            </div>
          </Marker>
        )}
      </Map>
      
      {/* Attribution Overlay */}
      <div className="absolute bottom-2 right-4 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-bold text-slate-400 z-10 pointer-events-none">
        OpenStreetMap • Maraude Maps
      </div>
    </div>
  );
};

export default GpsMap;
