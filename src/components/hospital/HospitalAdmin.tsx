import { useState } from "react";
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
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
}

const HospitalAdmin = () => {
  const { toast } = useToast();
  const [bedCapacity, setBedCapacity] = useState<BedCapacity[]>([
    { type: "ICU", available: 3, total: 12, icon: Heart },
    { type: "Emergency", available: 8, total: 20, icon: AlertTriangle },
    { type: "General Ward", available: 24, total: 50, icon: Bed },
    { type: "Pediatric", available: 6, total: 10, icon: Users },
  ]);

  const [incomingPatients] = useState<IncomingPatient[]>([
    {
      id: "EMR-2847",
      eta: 4,
      priority: "critical",
      condition: "Cardiac Emergency",
      ambulance: "Unit A-7",
      vitals: { heartRate: 142, bloodPressure: "180/110", temp: 37.8 },
    },
    {
      id: "EMR-2848",
      eta: 12,
      priority: "urgent",
      condition: "Trauma - MVA",
      ambulance: "Unit B-3",
      vitals: { heartRate: 98, bloodPressure: "120/80", temp: 36.9 },
    },
    {
      id: "EMR-2849",
      eta: 18,
      priority: "standard",
      condition: "Respiratory Distress",
      ambulance: "Unit C-1",
      vitals: { heartRate: 88, bloodPressure: "130/85", temp: 38.2 },
    },
  ]);

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

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-status-critical/10 border-status-critical text-status-critical";
      case "urgent": return "bg-status-warning/10 border-status-warning text-status-warning";
      default: return "bg-status-info/10 border-status-info text-status-info";
    }
  };

  const getOccupancyColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio <= 0.1) return "bg-status-critical";
    if (ratio <= 0.3) return "bg-status-warning";
    return "bg-status-success";
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">City General Hospital</h2>
          <p className="text-muted-foreground">Emergency Department Capacity</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border shadow-soft">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

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
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{bed.type}</p>
                      <p className="text-sm text-muted-foreground">{bed.total} total beds</p>
                    </div>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Occupied</span>
                    <span className="font-semibold text-foreground">{Math.round(occupancyPercent)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getOccupancyColor(bed.available, bed.total)}`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Adjust */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-foreground">{bed.available}</span>
                    <span className="text-muted-foreground ml-2">available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateBedCount(index, -1)}
                      disabled={bed.available === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateBedCount(index, 1)}
                      disabled={bed.available === bed.total}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Incoming Patients Queue */}
        <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Incoming Queue</h3>
                <p className="text-xs text-muted-foreground">{incomingPatients.length} patients en route</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border max-h-[500px] overflow-auto">
            {incomingPatients.map((patient, index) => (
              <div 
                key={patient.id} 
                className="p-4 hover:bg-muted/50 transition-colors animate-slide-in-right"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase border ${getPriorityStyle(patient.priority)}`}>
                    {patient.priority}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{patient.eta} min</span>
                  </div>
                </div>

                <p className="font-medium text-foreground">{patient.condition}</p>
                <p className="text-sm text-muted-foreground mt-1">{patient.ambulance} • #{patient.id}</p>

                {/* Vitals */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="w-4 h-4 text-status-critical" />
                    <span className="text-foreground">{patient.vitals.heartRate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-foreground">{patient.vitals.bloodPressure}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Thermometer className="w-4 h-4 text-status-warning" />
                    <span className="text-foreground">{patient.vitals.temp}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalAdmin;
