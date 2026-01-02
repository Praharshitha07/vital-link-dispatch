import { useState, useEffect } from "react";
import { Phone, MapPin, Clock, CheckCircle2, Truck, Hospital, Navigation, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type DispatchStatus = "idle" | "dispatching" | "onway" | "arrived";

const PatientPortal = () => {
  const [status, setStatus] = useState<DispatchStatus>("idle");
  const [eta, setEta] = useState<number | null>(null);
  const [ambulancePosition, setAmbulancePosition] = useState(0);
  const { toast } = useToast();

  // Simulate ambulance movement
  useEffect(() => {
    if (status === "onway" && eta) {
      const interval = setInterval(() => {
        setAmbulancePosition(prev => Math.min(prev + 2, 100));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [status, eta]);

  const handleEmergencyDispatch = () => {
    setStatus("dispatching");
    setAmbulancePosition(0);
    
    toast({
      title: "🚨 Emergency Dispatched",
      description: "Broadcasting GPS... Locating nearest ambulance...",
    });

    // Simulate dispatch sequence
    setTimeout(() => {
      setStatus("onway");
      setEta(8);
      toast({
        title: "LifeLink Connected",
        description: "Unit A-7 is racing to you. ETA: 8 minutes",
      });
    }, 2000);

    setTimeout(() => {
      setEta(4);
    }, 5000);

    setTimeout(() => {
      setStatus("arrived");
      setEta(null);
      setAmbulancePosition(100);
      toast({
        title: "Help Has Arrived",
        description: "Medical team is at your location",
      });
    }, 8000);
  };

  const resetDispatch = () => {
    setStatus("idle");
    setEta(null);
    setAmbulancePosition(0);
  };

  const statusSteps = [
    { id: "dispatching", label: "Dispatched", icon: Phone },
    { id: "onway", label: "On the Way", icon: Truck },
    { id: "arrived", label: "Arrived", icon: Hospital },
  ];

  const getStatusIndex = () => {
    switch (status) {
      case "dispatching": return 0;
      case "onway": return 1;
      case "arrived": return 2;
      default: return -1;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/30">
      {status === "idle" ? (
        /* SOS Interface - The "Pulse Button" occupying 40% of screen */
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-primary tracking-wide">LIFELINK</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Emergency Dispatch</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              One tap to request immediate medical assistance
            </p>
          </div>

          {/* The Massive Pulse Button - 40% of viewport height */}
          <div className="relative flex items-center justify-center" style={{ height: '40vh', width: '40vh', maxWidth: '320px', maxHeight: '320px' }}>
            {/* Outer glow rings */}
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse-ring" style={{ animationDelay: "1s" }} />
            
            <Button
              onClick={handleEmergencyDispatch}
              className="w-full h-full rounded-full bg-gradient-emergency text-primary-foreground shadow-glow-intense animate-pulse-glow hover:scale-105 transition-transform duration-300 border-4 border-primary/30"
            >
              <div className="flex flex-col items-center gap-4">
                <Phone className="w-16 h-16" />
                <span className="text-4xl font-black tracking-wider">SOS</span>
                <span className="text-sm font-medium opacity-80">TAP FOR HELP</span>
              </div>
            </Button>
          </div>

          {/* GPS Auto-share indicator */}
          <div className="mt-8 flex items-center gap-3 px-6 py-3 bg-card rounded-2xl border border-border shadow-soft animate-slide-up">
            <div className="w-3 h-3 rounded-full bg-status-success animate-pulse" />
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-foreground font-medium">GPS location will be shared automatically</span>
          </div>
        </div>
      ) : (
        /* Active Dispatch View */
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-auto">
          {/* Header with status */}
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${status === "arrived" ? "bg-status-success" : "bg-primary animate-siren"}`} />
              <span className="text-lg font-bold text-primary tracking-wide">LIFELINK ACTIVE</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {status === "arrived" ? "Help Has Arrived" : "Help is on the way"}
            </h2>
          </div>

          {/* Live Map Visualization */}
          <div className="flex-1 bg-card rounded-3xl border border-border shadow-soft overflow-hidden min-h-[300px] relative">
            {/* Map placeholder with ambulance movement */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5">
              <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            {/* Route visualization */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2">
              {/* Route line */}
              <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                  style={{ width: `${ambulancePosition}%` }}
                />
              </div>

              {/* Ambulance icon moving */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: `calc(${ambulancePosition}% - 24px)` }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-emergency shadow-glow-red flex items-center justify-center animate-ambulance">
                  <Truck className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Start point (You) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                <div className="w-8 h-8 rounded-full bg-accent shadow-glow-blue flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground whitespace-nowrap">You</span>
              </div>

              {/* End point (Hospital) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                <div className="w-8 h-8 rounded-full bg-status-success flex items-center justify-center">
                  <Hospital className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground whitespace-nowrap">Hospital</span>
              </div>
            </div>

            {/* ETA Overlay */}
            {eta && (
              <div className="absolute top-4 right-4 px-4 py-3 bg-card/95 backdrop-blur-sm rounded-2xl border border-border shadow-soft">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold text-accent">{eta} min</p>
                    <p className="text-xs text-muted-foreground">ETA</p>
                  </div>
                </div>
              </div>
            )}

            {/* Center nav icon */}
            <div className="absolute top-4 left-4">
              <Navigation className="w-6 h-6 text-accent" />
            </div>
          </div>

          {/* Status Progress Steps */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const currentIndex = getStatusIndex();
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                
                return (
                  <div key={step.id} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center relative z-10 flex-1">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-status-success text-primary-foreground"
                            : isCurrent
                            ? "bg-primary text-primary-foreground animate-pulse shadow-glow-red"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <Icon className="w-7 h-7" />
                        )}
                      </div>
                      <span
                        className={`text-sm mt-2 font-semibold ${
                          isCurrent ? "text-primary" : isCompleted ? "text-status-success" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-full h-1.5 mx-2 rounded-full transition-colors duration-300 ${
                          index < currentIndex ? "bg-status-success" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ambulance Info Card */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-night flex items-center justify-center">
                <Truck className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-foreground">Unit A-7</p>
                <p className="text-muted-foreground">Advanced Life Support</p>
                <p className="text-sm text-accent font-medium mt-1">Dr. Sarah Chen • EMT Michael Ross</p>
              </div>
              <Button variant="default" size="lg" className="bg-gradient-action hover:brightness-110">
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
            </div>
          </div>

          {status === "arrived" && (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={resetDispatch}
            >
              Close Request
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
