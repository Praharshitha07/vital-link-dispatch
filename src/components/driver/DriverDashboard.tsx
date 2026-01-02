import { useState, useEffect } from "react";
import { 
  Navigation, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle2,
  Mic,
  Volume2,
  ChevronUp,
  Heart,
  Activity,
  Hospital
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type DriverStatus = "available" | "dispatched" | "enroute" | "onscene" | "transporting";

interface CurrentCase {
  id: string;
  patientName: string;
  address: string;
  priority: "critical" | "urgent" | "standard";
  eta: number;
  hospital: string;
  vitals?: {
    heartRate: number;
    bloodPressure: string;
    condition: string;
  };
}

const DriverDashboard = () => {
  const [status, setStatus] = useState<DriverStatus>("available");
  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const [showVitals, setShowVitals] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const simulateNewCase = () => {
    setCurrentCase({
      id: "EMR-2847",
      patientName: "John Doe",
      address: "123 Main Street, Downtown",
      priority: "critical",
      eta: 6,
      hospital: "City General Hospital",
      vitals: {
        heartRate: 142,
        bloodPressure: "180/110",
        condition: "Cardiac Emergency"
      }
    });
    setStatus("dispatched");
    toast({
      title: "🚨 EMERGENCY DISPATCH",
      description: "Critical case assigned. Navigation starting...",
    });
  };

  const handlePickup = () => {
    setStatus("onscene");
    toast({
      title: "Patient Pickup Confirmed",
      description: "On scene. Providing care.",
    });
  };

  const handleDropoff = () => {
    setStatus("transporting");
    toast({
      title: "En Route to Hospital",
      description: `Heading to ${currentCase?.hospital}`,
    });
  };

  const completeCase = () => {
    setCurrentCase(null);
    setStatus("available");
    setShowVitals(false);
    toast({
      title: "✓ Case Completed",
      description: "Patient handoff successful. Ready for new dispatch.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-status-critical text-primary-foreground animate-blink";
      case "urgent": return "bg-status-warning text-primary-foreground";
      default: return "bg-status-info text-accent-foreground";
    }
  };

  return (
    <div className="h-full flex flex-col bg-secondary text-secondary-foreground">
      {/* Split-View: Upper 70% Map */}
      <div className="flex-[7] relative overflow-hidden">
        {/* Map placeholder - High contrast dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/95 to-secondary/90">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="driverGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            </pattern>
            <rect width="100" height="100" fill="url(#driverGrid)" />
          </svg>
        </div>

        {/* Navigation Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentCase ? (
            <div className="text-center">
              <Navigation className="w-20 h-20 text-accent mx-auto mb-4 animate-pulse" />
              <p className="text-2xl font-bold text-secondary-foreground">Turn-by-Turn Navigation</p>
              <p className="text-accent text-lg mt-2">
                <span className="font-semibold">{currentCase.eta} min</span> to destination
              </p>
              <div className="mt-4 px-6 py-3 bg-accent/20 rounded-2xl inline-block">
                <p className="text-sm text-secondary-foreground/80">{currentCase.address}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-status-success mx-auto mb-4" />
              <p className="text-xl font-semibold text-secondary-foreground">Ready for Dispatch</p>
              <p className="text-secondary-foreground/60 mt-2">Awaiting assignment</p>
              <Button 
                onClick={simulateNewCase}
                className="mt-6 bg-gradient-action hover:brightness-110"
                size="lg"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Simulate Emergency
              </Button>
            </div>
          )}
        </div>

        {/* Top Status Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-secondary to-transparent">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${status === "available" ? "bg-status-success" : "bg-status-critical animate-siren"}`} />
            <div>
              <p className="text-lg font-bold text-secondary-foreground capitalize">{status.replace("-", " ")}</p>
              <p className="text-sm text-secondary-foreground/60">Unit A-7 • Michael Chen</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono text-secondary-foreground/80">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <Button variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/10">
              <Volume2 className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/10">
              <Mic className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Vitals Sidebar Overlay (non-intrusive) */}
        {currentCase?.vitals && showVitals && (
          <div className="absolute top-20 right-4 w-56 bg-secondary/95 backdrop-blur-sm rounded-2xl border border-border/30 p-4 animate-slide-in-right shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-secondary-foreground">Patient Vitals</span>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-6 h-6 text-secondary-foreground/60"
                onClick={() => setShowVitals(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-status-critical" />
                <span className="text-secondary-foreground font-mono">{currentCase.vitals.heartRate} BPM</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-secondary-foreground font-mono">{currentCase.vitals.bloodPressure}</span>
              </div>
              <div className="pt-2 border-t border-border/30">
                <span className="text-sm text-secondary-foreground/80">{currentCase.vitals.condition}</span>
              </div>
            </div>
          </div>
        )}

        {/* Case Info Mini Card */}
        {currentCase && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-secondary/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-border/30">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getPriorityColor(currentCase.priority)}`}>
                {currentCase.priority}
              </span>
              <div>
                <p className="font-semibold text-secondary-foreground">{currentCase.patientName}</p>
                <p className="text-sm text-secondary-foreground/60">#{currentCase.id}</p>
              </div>
            </div>

            {currentCase.vitals && !showVitals && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-secondary/90 backdrop-blur-sm border border-border/30 text-secondary-foreground"
                onClick={() => setShowVitals(true)}
              >
                <Heart className="w-4 h-4 mr-1 text-status-critical" />
                Vitals
                <ChevronUp className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Lower 30%: Action Triggers */}
      <div className="flex-[3] bg-gradient-night p-4 border-t-2 border-primary/30">
        {currentCase ? (
          <div className="h-full flex gap-4">
            {/* PICKUP PATIENT Button (Amber) */}
            <Button
              onClick={handlePickup}
              disabled={status === "onscene" || status === "transporting"}
              className={`flex-1 h-full text-2xl font-bold rounded-2xl transition-all duration-300 ${
                status === "onscene" || status === "transporting"
                  ? "bg-muted/20 text-muted-foreground opacity-50"
                  : "bg-gradient-pickup text-primary-foreground hover:brightness-110 shadow-lg"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <User className="w-10 h-10" />
                <span>PICKUP PATIENT</span>
                {status !== "onscene" && status !== "transporting" && (
                  <span className="text-sm font-normal opacity-80">Tap when on scene</span>
                )}
              </div>
            </Button>

            {/* DROP AT HOSPITAL Button (Green) */}
            <Button
              onClick={status === "transporting" ? completeCase : handleDropoff}
              disabled={status !== "onscene" && status !== "transporting"}
              className={`flex-1 h-full text-2xl font-bold rounded-2xl transition-all duration-300 ${
                status !== "onscene" && status !== "transporting"
                  ? "bg-muted/20 text-muted-foreground opacity-50"
                  : "bg-gradient-dropoff text-primary-foreground hover:brightness-110 shadow-lg"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Hospital className="w-10 h-10" />
                <span>{status === "transporting" ? "COMPLETE HANDOFF" : "DROP AT HOSPITAL"}</span>
                {(status === "onscene" || status === "transporting") && (
                  <span className="text-sm font-normal opacity-80">
                    {status === "transporting" ? "Tap to complete" : "Start transport"}
                  </span>
                )}
              </div>
            </Button>
          </div>
        ) : (
          /* No active case - show status */
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-status-success/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-status-success" />
              </div>
              <p className="text-xl font-semibold text-secondary-foreground">Available for Dispatch</p>
              <p className="text-secondary-foreground/60 mt-1">Waiting for next assignment...</p>
            </div>
          </div>
        )}

        {/* Quick Action Buttons */}
        {currentCase && (
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 h-12 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Patient
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Dispatch
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              <Hospital className="w-5 h-5 mr-2" />
              Call Hospital
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
