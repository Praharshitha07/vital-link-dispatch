import { 
  Phone, 
  Truck, 
  Building2, 
  LayoutDashboard,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "patient", label: "Patient Portal", icon: Phone, description: "Emergency dispatch" },
  { id: "driver", label: "Driver App", icon: Truck, description: "Navigation & status" },
  { id: "hospital", label: "Hospital Admin", icon: Building2, description: "Capacity management" },
  { id: "control", label: "Control Center", icon: LayoutDashboard, description: "Analytics & overview" },
];

const AppSidebar = ({ currentView, onViewChange }: AppSidebarProps) => {
  return (
    <aside className="w-72 h-full bg-secondary flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs font-semibold text-secondary-foreground/60 uppercase tracking-wider px-3 mb-4">
          Interfaces
        </p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-glow-red" 
                  : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                isActive ? "bg-primary-foreground/20" : "bg-secondary-foreground/10"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{item.label}</p>
                <p className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/70" : "text-secondary-foreground/50"
                )}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-secondary-foreground/10">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground/70 hover:bg-secondary-foreground/10 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground/70 hover:bg-secondary-foreground/10 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Help & Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
