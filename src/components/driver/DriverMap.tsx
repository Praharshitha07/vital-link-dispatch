import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface DriverMapProps {
  destination?: {
    lng: number;
    lat: number;
    address: string;
  };
  onEtaUpdate?: (eta: number) => void;
}

const DriverMap = ({ destination, onEtaUpdate }: DriverMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const ambulanceMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Default center (can be user's location in production)
  const defaultCenter: [number, number] = [-74.006, 40.7128]; // NYC

  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;

    mapboxgl.accessToken = mapToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: defaultCenter,
        zoom: 14,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Create custom ambulance marker
      const ambulanceEl = document.createElement('div');
      ambulanceEl.className = 'ambulance-marker';
      ambulanceEl.innerHTML = `
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
      `;

      ambulanceMarker.current = new mapboxgl.Marker({
        element: ambulanceEl,
        anchor: 'center',
      })
        .setLngLat(defaultCenter)
        .addTo(map.current);

      // Simulate ambulance movement
      let position = [...defaultCenter];
      const moveInterval = setInterval(() => {
        if (destination && map.current) {
          const dx = (destination.lng - position[0]) * 0.02;
          const dy = (destination.lat - position[1]) * 0.02;
          position[0] += dx;
          position[1] += dy;
          ambulanceMarker.current?.setLngLat(position as [number, number]);
          
          // Calculate ETA based on distance
          const distance = Math.sqrt(
            Math.pow(destination.lng - position[0], 2) + 
            Math.pow(destination.lat - position[1], 2)
          );
          const eta = Math.max(1, Math.round(distance * 500));
          onEtaUpdate?.(eta);
        }
      }, 1000);

      setShowTokenInput(false);

      return () => {
        clearInterval(moveInterval);
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }
  }, [mapToken, destination, onEtaUpdate]);

  // Add destination marker when destination changes
  useEffect(() => {
    if (!map.current || !destination) return;

    const destEl = document.createElement('div');
    destEl.innerHTML = `
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
        <div style="transform: rotate(45deg); color: white; font-weight: bold;">📍</div>
      </div>
    `;

    new mapboxgl.Marker({ element: destEl })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map.current);

    map.current.flyTo({
      center: [destination.lng, destination.lat],
      zoom: 15,
      pitch: 60,
    });
  }, [destination]);

  if (showTokenInput) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-secondary/95 backdrop-blur-sm">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 border border-border/30 shadow-xl">
          <h3 className="text-lg font-bold text-foreground mb-2">Enable Live Map</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox public token to enable real-time navigation. 
            Get yours at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">mapbox.com</a>
          </p>
          <input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            onChange={(e) => setMapToken(e.target.value)}
          />
          <button
            onClick={() => setMapToken(mapToken)}
            className="w-full py-3 bg-gradient-action text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all"
          >
            Enable Navigation
          </button>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="absolute inset-0" />;
};

export default DriverMap;
