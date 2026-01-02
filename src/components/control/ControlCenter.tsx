import { 
  Activity, 
  Clock, 
  Truck, 
  Building2, 
  TrendingUp,
  TrendingDown,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Users
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  status?: "success" | "warning" | "critical" | "info";
}

const MetricCard = ({ title, value, change, icon: Icon, status = "info" }: MetricCardProps) => {
  const statusColors = {
    success: "text-status-success bg-status-success/10",
    warning: "text-status-warning bg-status-warning/10",
    critical: "text-status-critical bg-status-critical/10",
    info: "text-accent bg-accent/10",
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-soft animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusColors[status]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? "text-status-success" : "text-status-critical"}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
};

interface AmbulanceStatus {
  id: string;
  driver: string;
  status: "available" | "dispatched" | "enroute" | "onscene";
  location: string;
  eta?: number;
}

const ControlCenter = () => {
  const ambulanceFleet: AmbulanceStatus[] = [
    { id: "A-7", driver: "Michael Chen", status: "enroute", location: "Downtown", eta: 4 },
    { id: "B-3", driver: "Sarah Johnson", status: "onscene", location: "Westside" },
    { id: "C-1", driver: "David Park", status: "available", location: "North Station" },
    { id: "A-2", driver: "Emily Davis", status: "dispatched", location: "East District", eta: 8 },
    { id: "B-5", driver: "James Wilson", status: "available", location: "Central Hub" },
    { id: "C-4", driver: "Lisa Martinez", status: "enroute", location: "Southside", eta: 6 },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available": return "bg-status-success text-primary-foreground";
      case "dispatched": 
      case "enroute": return "bg-status-warning text-primary-foreground";
      case "onscene": return "bg-status-critical text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const heatmapZones = [
    { name: "Downtown", incidents: 24, risk: "high" },
    { name: "Westside", incidents: 12, risk: "medium" },
    { name: "North District", incidents: 6, risk: "low" },
    { name: "East Zone", incidents: 18, risk: "high" },
    { name: "South Area", incidents: 9, risk: "medium" },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-status-critical";
      case "medium": return "bg-status-warning";
      default: return "bg-status-success";
    }
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Command Center</h2>
          <p className="text-muted-foreground">Real-time emergency coordination</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-status-success/10 rounded-xl border border-status-success/20">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span className="text-sm font-medium text-status-success">All Systems Operational</span>
          </div>
          <div className="px-4 py-2 bg-card rounded-xl border border-border shadow-soft">
            <span className="text-sm text-muted-foreground">Last updated: </span>
            <span className="font-semibold text-foreground">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Response Time"
          value="6.2 min"
          change={-12}
          icon={Clock}
          status="success"
        />
        <MetricCard
          title="Active Ambulances"
          value="4/6"
          icon={Truck}
          status="warning"
        />
        <MetricCard
          title="Hospital Capacity"
          value="78%"
          change={5}
          icon={Building2}
          status="info"
        />
        <MetricCard
          title="Cases Today"
          value="47"
          change={8}
          icon={Activity}
          status="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Overview */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              Fleet Status
            </h3>
          </div>
          <div className="divide-y divide-border">
            {ambulanceFleet.map((ambulance, index) => (
              <div 
                key={ambulance.id}
                className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors animate-slide-in-right"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-navy flex items-center justify-center text-secondary-foreground font-bold">
                    {ambulance.id}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{ambulance.driver}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {ambulance.location}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {ambulance.eta && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ETA</p>
                      <p className="font-semibold text-foreground">{ambulance.eta} min</p>
                    </div>
                  )}
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getStatusStyle(ambulance.status)}`}>
                    {ambulance.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Heatmap */}
        <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-status-warning" />
              Incident Zones
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {heatmapZones.map((zone, index) => (
              <div 
                key={zone.name}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(zone.risk)}`} />
                  <span className="font-medium text-foreground">{zone.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{zone.incidents}</p>
                  <p className="text-xs text-muted-foreground">incidents</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-navy rounded-2xl p-6 flex items-center justify-around">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-status-success" />
            <span className="text-2xl font-bold text-secondary-foreground">42</span>
          </div>
          <p className="text-sm text-secondary-foreground/70">Successful Rescues</p>
        </div>
        <div className="w-px h-12 bg-secondary-foreground/20" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold text-secondary-foreground">156</span>
          </div>
          <p className="text-sm text-secondary-foreground/70">Patients Treated</p>
        </div>
        <div className="w-px h-12 bg-secondary-foreground/20" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-status-warning" />
            <span className="text-2xl font-bold text-secondary-foreground">5.8</span>
          </div>
          <p className="text-sm text-secondary-foreground/70">Avg Minutes to Scene</p>
        </div>
        <div className="w-px h-12 bg-secondary-foreground/20" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-status-success" />
            <span className="text-2xl font-bold text-secondary-foreground">98.5%</span>
          </div>
          <p className="text-sm text-secondary-foreground/70">Success Rate</p>
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
