import { useEffect, useState, useCallback } from 'react';
import { Navigation, MapPin, Zap } from 'lucide-react';

interface DriverMapProps {
  destination?: {
    lng: number;
    lat: number;
    address: string;
  };
  onEtaUpdate?: (eta: number) => void;
}

interface Position {
  x: number;
  y: number;
}

const DriverMap = ({ destination, onEtaUpdate }: DriverMapProps) => {
  const [ambulancePos, setAmbulancePos] = useState<Position>({ x: 30, y: 60 });
  const [destinationPos, setDestinationPos] = useState<Position>({ x: 70, y: 30 });
  const [trail, setTrail] = useState<Position[]>([]);
  const [eta, setEta] = useState(8);
  const [speed, setSpeed] = useState(0);

  // Generate random destination when destination prop changes
  useEffect(() => {
    if (destination) {
      setDestinationPos({
        x: 20 + Math.random() * 60,
        y: 15 + Math.random() * 50,
      });
    }
  }, [destination]);

  // Animate ambulance movement toward destination
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setAmbulancePos((prev) => {
        const dx = (destinationPos.x - prev.x) * 0.03;
        const dy = (destinationPos.y - prev.y) * 0.03;
        
        const newPos = {
          x: prev.x + dx + (Math.random() - 0.5) * 0.5,
          y: prev.y + dy + (Math.random() - 0.5) * 0.5,
        };

        // Add to trail
        setTrail((t) => [...t.slice(-20), prev]);

        // Calculate distance and ETA
        const distance = Math.sqrt(
          Math.pow(destinationPos.x - newPos.x, 2) +
          Math.pow(destinationPos.y - newPos.y, 2)
        );
        const newEta = Math.max(1, Math.round(distance / 5));
        setEta(newEta);
        setSpeed(Math.round(30 + Math.random() * 20));
        onEtaUpdate?.(newEta);

        return newPos;
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [destinationPos, onEtaUpdate]);

  // Generate random movement for destination periodically
  const generateNewDestination = useCallback(() => {
    setDestinationPos({
      x: 15 + Math.random() * 70,
      y: 10 + Math.random() * 60,
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-night-black via-secondary to-night-black overflow-hidden">
      {/* Grid overlay for map effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 122, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 122, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Road lines simulation */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Main roads */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="20" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.15)" strokeWidth="20" />
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
        
        {/* Trail path */}
        {trail.map((pos, i) => (
          <circle
            key={i}
            cx={`${pos.x}%`}
            cy={`${pos.y}%`}
            r={2}
            fill={`rgba(255, 59, 48, ${0.1 + (i / trail.length) * 0.4})`}
          />
        ))}

        {/* Route line from ambulance to destination */}
        <line
          x1={`${ambulancePos.x}%`}
          y1={`${ambulancePos.y}%`}
          x2={`${destinationPos.x}%`}
          y2={`${destinationPos.y}%`}
          stroke="rgba(0, 122, 255, 0.6)"
          strokeWidth="3"
          strokeDasharray="10,5"
          className="animate-pulse"
        />
      </svg>

      {/* Destination marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ left: `${destinationPos.x}%`, top: `${destinationPos.y}%` }}
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-action-blue/30 rounded-full animate-ping" />
          <div className="w-10 h-10 bg-action-blue rounded-full flex items-center justify-center shadow-lg shadow-action-blue/50">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-action-blue/90 px-2 py-0.5 rounded text-xs text-primary-foreground whitespace-nowrap">
            {destination?.address || 'Patient Location'}
          </div>
        </div>
      </div>

      {/* Ambulance marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-100"
        style={{ left: `${ambulancePos.x}%`, top: `${ambulancePos.y}%` }}
      >
        <div className="relative">
          <div className="absolute -inset-6 bg-pulse-red/20 rounded-full animate-pulse-glow" />
          <div className="w-14 h-14 bg-gradient-to-br from-pulse-red to-red-600 rounded-full flex items-center justify-center shadow-xl shadow-pulse-red/50 border-2 border-white/30">
            {/* Custom Ambulance Icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
              <rect x="1" y="4" width="15" height="11" rx="2" fill="currentColor" opacity="0.3"/>
              <rect x="1" y="4" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 8h2.5a2 2 0 0 1 1.6.8l1.5 2a2 2 0 0 1 .4 1.2V14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="5.5" cy="17.5" r="2" fill="currentColor"/>
              <circle cx="16.5" cy="17.5" r="2" fill="currentColor"/>
              <line x1="8" y1="7" x2="8" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="5.5" y1="9.5" x2="10.5" y2="9.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation HUD overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
        {/* Speed indicator */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border/30">
          <div className="text-3xl font-bold text-foreground">{speed}</div>
          <div className="text-xs text-muted-foreground">km/h</div>
        </div>

        {/* ETA display */}
        <div className="bg-gradient-action rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary-foreground" />
            <div>
              <div className="text-2xl font-bold text-primary-foreground">{eta} min</div>
              <div className="text-xs text-primary-foreground/80">ETA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom direction indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-action-blue rounded-lg flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary-foreground rotate-45" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Next turn</div>
              <div className="text-foreground font-semibold">Continue on Main Street</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">0.3</div>
              <div className="text-xs text-muted-foreground">km</div>
            </div>
          </div>
        </div>
      </div>

      {/* New destination button */}
      <button
        onClick={generateNewDestination}
        className="absolute top-4 right-20 z-30 bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border/30 hover:bg-accent transition-colors"
        title="Simulate new destination"
      >
        <Zap className="w-5 h-5 text-warning" />
      </button>
    </div>
  );
};

export default DriverMap;
