import { useState } from "react";
import { Phone, MapPin, Clock, CheckCircle2, Truck, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type DispatchStatus = "idle" | "dispatching" | "onway" | "arrived";

const PatientPortal = () => {
  const [status, setStatus] = useState<DispatchStatus>("idle");
  const [eta, setEta] = useState<number | null>(null);
  const { toast } = useToast();

  const handleEmergencyDispatch = () => {
    setStatus("dispatching");
    
    toast({
      title: "Emergency Dispatched",
      description: "Locating nearest available ambulance...",
    });

    // Simulate dispatch sequence
    setTimeout(() => {
      setStatus("onway");
      setEta(8);
      toast({
        title: "Ambulance Dispatched",
        description: "Unit A-7 is on the way. ETA: 8 minutes",
      });
    }, 2000);

    setTimeout(() => {
      setEta(4);
    }, 5000);

    setTimeout(() => {
      setStatus("arrived");
      setEta(null);
      toast({
        title: "Ambulance Arrived",
        description: "Medical team is at your location",
      });
    }, 8000);
  };

  const resetDispatch = () => {
    setStatus("idle");
    setEta(null);
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
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Emergency Dispatch</h2>
          <p className="text-muted-foreground mt-2">
            One tap to request immediate medical assistance
          </p>
        </div>

        {/* Emergency Button */}
        {status === "idle" ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
              
              <Button
                variant="emergency"
                size="icon-xl"
                className="w-40 h-40 rounded-full text-2xl font-bold relative z-10"
                onClick={handleEmergencyDispatch}
              >
                <div className="flex flex-col items-center gap-2">
                  <Phone className="w-10 h-10" />
                  <span>SOS</span>
                </div>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">GPS location will be shared automatically</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Progress */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
              <div className="flex items-center justify-between mb-6">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const currentIndex = getStatusIndex();
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  
                  return (
                    <div key={step.id} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? "bg-status-success text-primary-foreground"
                              : isCurrent
                              ? "bg-primary text-primary-foreground animate-pulse"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium ${
                            isCurrent ? "text-primary" : isCompleted ? "text-status-success" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${
                            index < currentIndex ? "bg-status-success" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ETA Display */}
              {eta && (
                <div className="flex items-center justify-center gap-3 p-4 bg-accent/10 rounded-xl">
                  <Clock className="w-6 h-6 text-accent" />
                  <div>
                    <p className="text-2xl font-bold text-accent">{eta} min</p>
                    <p className="text-sm text-muted-foreground">Estimated arrival</p>
                  </div>
                </div>
              )}

              {status === "arrived" && (
                <div className="p-4 bg-status-success/10 rounded-xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-status-success mx-auto mb-2" />
                  <p className="font-semibold text-status-success">Help has arrived</p>
                  <p className="text-sm text-muted-foreground mt-1">Medical team is at your location</p>
                </div>
              )}
            </div>

            {/* Ambulance Info */}
            <div className="bg-card rounded-2xl p-4 shadow-soft border border-border animate-slide-in-right">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-navy flex items-center justify-center">
                  <Truck className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Unit A-7</p>
                  <p className="text-sm text-muted-foreground">Advanced Life Support</p>
                </div>
                <Button variant="secondary" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>

            {status === "arrived" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={resetDispatch}
              >
                Close Request
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortal;
