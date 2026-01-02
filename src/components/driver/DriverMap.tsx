import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DriverMapProps {
  destination?: {
    lng: number;
    lat: number;
    address: string;
  };
  onEtaUpdate?: (eta: number) => void;
}

// Custom ambulance icon
const ambulanceIcon = new L.DivIcon({
  className: 'ambulance-marker',
  html: `
    <div style="
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(255, 59, 48, 0.5);
      animation: pulse-glow 2s infinite;
    ">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
        <line x1="16" y1="8" x2="20" y2="8"></line>
        <line x1="18" y1="6" x2="18" y2="10"></line>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="12.5" cy="18.5" r="2.5"></circle>
        <path d="M16 16V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10"></path>
      </svg>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

// Destination marker icon
const destinationIcon = new L.DivIcon({
  className: 'destination-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #007AFF;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
    ">
      <span style="transform: rotate(45deg); color: white; font-size: 14px;">🏥</span>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Component to animate ambulance movement
const AnimatedAmbulance = ({ 
  destination, 
  onEtaUpdate 
}: { 
  destination?: { lng: number; lat: number; address: string }; 
  onEtaUpdate?: (eta: number) => void;
}) => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number]>([28.6139, 77.2090]); // Delhi

  useEffect(() => {
    if (!destination) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const dx = (destination.lng - prev[1]) * 0.02;
        const dy = (destination.lat - prev[0]) * 0.02;
        const newPos: [number, number] = [prev[0] + dy, prev[1] + dx];
        
        // Calculate ETA
        const distance = Math.sqrt(
          Math.pow(destination.lng - newPos[1], 2) + 
          Math.pow(destination.lat - newPos[0], 2)
        );
        const eta = Math.max(1, Math.round(distance * 500));
        onEtaUpdate?.(eta);

        return newPos;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [destination, onEtaUpdate]);

  useEffect(() => {
    if (destination) {
      map.flyTo([destination.lat, destination.lng], 14);
    }
  }, [destination, map]);

  return (
    <>
      <Marker position={position} icon={ambulanceIcon}>
        <Popup>
          <div className="font-semibold text-pulse">🚑 Ambulance</div>
          <div className="text-sm">En route to destination</div>
        </Popup>
      </Marker>
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>
            <div className="font-semibold text-action">🏥 Destination</div>
            <div className="text-sm">{destination.address}</div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

const DriverMap = ({ destination, onEtaUpdate }: DriverMapProps) => {
  // Default center - Delhi, India
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AnimatedAmbulance destination={destination} onEtaUpdate={onEtaUpdate} />
      </MapContainer>
      
      {/* Map overlay gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      
      {/* Navigation status */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-border/30 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald animate-pulse" />
          <span className="text-sm font-medium text-foreground">Live Navigation Active</span>
        </div>
      </div>
    </div>
  );
};

export default DriverMap;
