import { useState, useEffect, useRef } from "react";
import { 
  Bed, 
  Users, 
  AlertTriangle, 
  Clock, 
  Truck,
  Heart,
  Thermometer,
  Activity,
  Plus,
  Minus,
  Building2,
  ChevronDown,
  Volume2,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Facility {
  id: string;
  name: string;
  type: string;
}

interface BedCapacity {
  type: string;
  available: number;
  total: number;
  icon: React.ElementType;
}

interface IncomingPatient {
  id: string;
  eta: number;
  priority: "critical" | "urgent" | "standard";
  condition: string;
  ambulance: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temp: number;
  };
  distance: number;
}

const HospitalAdmin = () => {
  const { toast } = useToast();
  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const sirenAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const [facilities] = useState<Facility[]>([
    { id: "cgh", name: "City General Hospital", type: "Main Campus" },
    { id: "ew", name: "East Wing Medical", type: "Specialty Care" },
    { id: "nc", name: "North Clinic", type: "Urgent Care" },
  ]);
  
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [viewMode, setViewMode] = useState<"single" | "unified">("single");

  const [bedCapacity, setBedCapacity] = useState<BedCapacity[]>([
    { type: "ICU", available: 3, total: 12, icon: Heart },
    { type: "Emergency", available: 8, total: 20, icon: AlertTriangle },
    { type: "General Ward", available: 24, total: 50, icon: Bed },
    { type: "Pediatric", available: 6, total: 10, icon: Users },
  ]);

  const [incomingPatients, setIncomingPatients] = useState<IncomingPatient[]>([
    {
      id: "EMR-2847",
      eta: 4,
      priority: "critical",
      condition: "Cardiac Emergency",
      ambulance: "Unit A-7",
      vitals: { heartRate: 142, bloodPressure: "180/110", temp: 37.8 },
      distance: 1.8,
    },
    {
      id: "EMR-2848",
      eta: 12,
      priority: "urgent",
      condition: "Trauma - MVA",
      ambulance: "Unit B-3",
      vitals: { heartRate: 98, bloodPressure: "120/80", temp: 36.9 },
      distance: 4.2,
    },
    {
      id: "EMR-2849",
      eta: 18,
      priority: "standard",
      condition: "Respiratory Distress",
      ambulance: "Unit C-1",
      vitals: { heartRate: 88, bloodPressure: "130/85", temp: 38.2 },
      distance: 6.5,
    },
  ]);

  // Check for incoming ambulance within 2km
  useEffect(() => {
    const criticalPatient = incomingPatients.find(p => p.distance < 2 && p.priority === "critical");
    if (criticalPatient && !sirenActive) {
      setSirenActive(true);
      toast({
        title: "🚨 INBOUND ALERT",
        description: `Critical patient ${criticalPatient.eta} min away - ${criticalPatient.condition}`,
        variant: "destructive",
      });
    }
  }, [incomingPatients, sirenActive, toast]);

  const updateBedCount = (index: number, delta: number) => {
    setBedCapacity(prev => {
      const updated = [...prev];
      const newAvailable = Math.max(0, Math.min(updated[index].total, updated[index].available + delta));
      updated[index] = { ...updated[index], available: newAvailable };
      return updated;
    });
    toast({
      title: "Capacity Updated",
      description: `${bedCapacity[index].type} beds updated.`,
    });
  };

  const getTriageColor = (priority: string) => {
    switch (priority) {
      case "critical": return { bg: "bg-status-critical", text: "text-primary-foreground", label: "RED" };
      case "urgent": return { bg: "bg-status-warning", text: "text-primary-foreground", label: "YELLOW" };
      default: return { bg: "bg-status-success", text: "text-primary-foreground", label: "GREEN" };
    }
  };

  const getOccupancyColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio <= 0.1) return "bg-status-critical";
    if (ratio <= 0.3) return "bg-status-warning";
    return "bg-status-success";
  };

  const dismissSiren = () => {
    setSirenActive(false);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Siren Alert Banner */}
      {sirenActive && (
        <div className="bg-status-critical animate-siren px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary-foreground animate-bounce" />
            <span className="text-primary-foreground font-bold text-lg">
              🚨 AMBULANCE INCOMING &lt; 2km - CRITICAL PATIENT
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={dismissSiren}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header with Facility Switcher */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Facility Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-3 h-14 px-5 border-2"
                onClick={() => setShowFacilityDropdown(!showFacilityDropdown)}
              >
                <Building2 className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">{selectedFacility.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedFacility.type}</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showFacilityDropdown ? "rotate-180" : ""}`} />
              </Button>

              {showFacilityDropdown && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden animate-scale-in">
                  {facilities.map((facility) => (
                    <button
                      key={facility.id}
                      className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                        selectedFacility.id === facility.id ? "bg-accent/10" : ""
                      }`}
                      onClick={() => {
                        setSelectedFacility(facility);
                        setShowFacilityDropdown(false);
                      }}
                    >
                      <Building2 className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">{facility.name}</p>
                        <p className="text-xs text-muted-foreground">{facility.type}</p>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-border">
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors text-accent font-medium"
                      onClick={() => {
                        setViewMode("unified");
                        setShowFacilityDropdown(false);
                      }}
                    >
                      View Unified Grid (All Facilities)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {viewMode === "unified" && (
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                Unified View
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Volume2 className="w-5 h-5" />
              {sirenActive && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-status-critical rounded-full animate-ping" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bed Capacity Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {bedCapacity.map((bed, index) => {
              const Icon = bed.icon;
              const occupancyPercent = ((bed.total - bed.available) / bed.total) * 100;
              
              return (
                <div 
                  key={bed.type}
                  className="bg-card rounded-2xl p-5 border border-border shadow-soft animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{bed.type}</p>
                        <p className="text-sm text-muted-foreground">{bed.total} total beds</p>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Occupied</span>
                      <span className="font-bold text-foreground">{Math.round(occupancyPercent)}%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${getOccupancyColor(bed.available, bed.total)}`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Adjust - Large touch targets */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-4xl font-black text-foreground">{bed.available}</span>
                      <span className="text-muted-foreground ml-2 text-lg">available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-14 h-14 text-2xl"
                        onClick={() => updateBedCount(index, -1)}
                        disabled={bed.available === 0}
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-14 h-14 text-2xl"
                        onClick={() => updateBedCount(index, 1)}
                        disabled={bed.available === bed.total}
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Incoming Patients Queue */}
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Incoming Queue</h3>
                  <p className="text-sm text-muted-foreground">{incomingPatients.length} patients en route</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border max-h-[600px] overflow-auto">
              {incomingPatients.map((patient, index) => {
                const triage = getTriageColor(patient.priority);
                const isNearby = patient.distance < 2;
                
                return (
                  <div 
                    key={patient.id} 
                    className={`p-4 hover:bg-muted/50 transition-colors animate-slide-in-right ${isNearby ? "bg-status-critical/5" : ""}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {/* Triage Badge - Red/Yellow/Green */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${triage.bg} ${triage.text} ${isNearby ? "animate-blink" : ""}`}>
                          {triage.label}
                        </span>
                        {isNearby && (
                          <span className="text-xs font-bold text-status-critical animate-pulse">
                            NEARBY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-foreground text-lg">{patient.eta} min</span>
                      </div>
                    </div>

                    <p className="font-semibold text-foreground text-lg">{patient.condition}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {patient.ambulance} • #{patient.id} • {patient.distance}km away
                    </p>

                    {/* Vitals */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Heart className="w-4 h-4 text-status-critical" />
                        <span className="text-foreground font-mono font-medium">{patient.vitals.heartRate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="text-foreground font-mono font-medium">{patient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Thermometer className="w-4 h-4 text-status-warning" />
                        <span className="text-foreground font-mono font-medium">{patient.vitals.temp}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalAdmin;
