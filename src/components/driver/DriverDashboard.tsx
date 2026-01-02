import { useState } from "react";
import { 
  Navigation, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle2,
  Mic,
  Volume2
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
}

const DriverDashboard = () => {
  const [status, setStatus] = useState<DriverStatus>("available");
  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const { toast } = useToast();

  const simulateNewCase = () => {
    setCurrentCase({
      id: "EMR-2847",
      patientName: "John Doe",
      address: "123 Main Street, Downtown",
      priority: "critical",
      eta: 6,
      hospital: "City General Hospital",
    });
    setStatus("dispatched");
    toast({
      title: "New Emergency Case",
      description: "Critical case assigned. Review details below.",
    });
  };

  const handleStatusUpdate = (newStatus: DriverStatus) => {
    setStatus(newStatus);
    const statusMessages: Record<DriverStatus, string> = {
      available: "Status: Available for dispatch",
      dispatched: "Case accepted. Starting navigation.",
      enroute: "En route to patient location.",
      onscene: "Arrived at scene. Providing care.",
      transporting: "Transporting to hospital.",
    };
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus],
    });
  };

  const completeCase = () => {
    setCurrentCase(null);
    setStatus("available");
    toast({
      title: "Case Completed",
      description: "Patient handoff successful. Ready for new dispatch.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-status-critical text-primary-foreground";
      case "urgent": return "bg-status-warning text-primary-foreground";
      default: return "bg-status-info text-accent-foreground";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "available": return "bg-status-success";
      case "dispatched": 
      case "enroute": return "bg-status-warning";
      case "onscene":
      case "transporting": return "bg-status-critical";
      default: return "bg-muted";
    }
  };

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-4 h-4 rounded-full ${getStatusColor()} animate-pulse`} />
          <div>
            <h2 className="text-xl font-bold text-foreground capitalize">{status.replace("-", " ")}</h2>
            <p className="text-sm text-muted-foreground">Unit A-7 • Michael Chen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon">
            <Mic className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
          <div className="h-full min-h-[400px] bg-gradient-to-br from-accent/5 to-secondary/5 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            <div className="text-center z-10">
              <Navigation className="w-12 h-12 text-accent mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">Navigation Display</p>
              <p className="text-sm text-muted-foreground mt-1">Real-time GPS tracking</p>
              {currentCase && (
                <div className="mt-4 px-4 py-2 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-accent">ETA: {currentCase.eta} minutes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          {/* Current Case */}
          {currentCase ? (
            <div className="bg-card rounded-2xl p-5 border border-border shadow-soft animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Current Case</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPriorityColor(currentCase.priority)}`}>
                  {currentCase.priority}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{currentCase.patientName}</p>
                    <p className="text-sm text-muted-foreground">Case #{currentCase.id}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-foreground">{currentCase.address}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-foreground">ETA: {currentCase.eta} minutes</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Patient
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Dispatch
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-5 border border-border shadow-soft text-center">
              <CheckCircle2 className="w-12 h-12 text-status-success mx-auto mb-3" />
              <p className="font-semibold text-foreground">Ready for Dispatch</p>
              <p className="text-sm text-muted-foreground mt-1">Awaiting new case assignment</p>
              <Button 
                variant="secondary" 
                className="mt-4 w-full"
                onClick={simulateNewCase}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Simulate New Case
              </Button>
            </div>
          )}

          {/* Status Controls */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Quick Status</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={status === "available" ? "default" : "outline"}
                size="lg"
                onClick={() => handleStatusUpdate("available")}
                disabled={!!currentCase}
                className="h-16 text-base"
              >
                Available
              </Button>
              <Button
                variant={status === "enroute" ? "destructive" : "outline"}
                size="lg"
                onClick={() => handleStatusUpdate("enroute")}
                disabled={!currentCase}
                className="h-16 text-base"
              >
                En Route
              </Button>
              <Button
                variant={status === "onscene" ? "destructive" : "outline"}
                size="lg"
                onClick={() => handleStatusUpdate("onscene")}
                disabled={!currentCase}
                className="h-16 text-base"
              >
                On Scene
              </Button>
              <Button
                variant={status === "transporting" ? "destructive" : "outline"}
                size="lg"
                onClick={() => handleStatusUpdate("transporting")}
                disabled={!currentCase}
                className="h-16 text-base"
              >
                Transport
              </Button>
            </div>
            
            {currentCase && status === "transporting" && (
              <Button
                variant="default"
                size="lg"
                className="w-full mt-3 h-16 text-base bg-status-success hover:bg-status-success/90"
                onClick={completeCase}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Handoff
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
