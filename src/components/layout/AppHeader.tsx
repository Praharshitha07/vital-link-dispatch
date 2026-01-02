import { Activity, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  currentView: string;
}

const AppHeader = ({ currentView }: AppHeaderProps) => {
  const getViewTitle = () => {
    switch (currentView) {
      case "patient":
        return "Emergency Services";
      case "driver":
        return "Driver Dashboard";
      case "hospital":
        return "Hospital Admin";
      case "control":
        return "Control Center";
      default:
        return "Vital Guard";
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-soft">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-emergency flex items-center justify-center shadow-glow-red">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Vital Guard</h1>
          <p className="text-xs text-muted-foreground">{getViewTitle()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-success/10 border border-status-success/20">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-sm font-medium text-status-success">System Online</span>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
