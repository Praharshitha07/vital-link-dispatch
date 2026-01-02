import { useState } from "react";
import { 
  Settings, 
  Bell, 
  Volume2, 
  Moon, 
  Sun, 
  MapPin, 
  Vibrate,
  Globe,
  Shield,
  LogOut
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsSheetProps {
  trigger: React.ReactNode;
}

const SettingsSheet = ({ trigger }: SettingsSheetProps) => {
  const [settings, setSettings] = useState({
    notifications: true,
    soundAlerts: true,
    darkMode: true,
    locationSharing: true,
    vibration: true,
    autoRouting: true,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingItems = [
    {
      id: "notifications",
      icon: Bell,
      label: "Push Notifications",
      description: "Receive dispatch and status updates",
    },
    {
      id: "soundAlerts",
      icon: Volume2,
      label: "Sound Alerts",
      description: "Play audio for emergency dispatches",
    },
    {
      id: "darkMode",
      icon: settings.darkMode ? Moon : Sun,
      label: "Dark Mode",
      description: "Optimized for night driving",
    },
    {
      id: "locationSharing",
      icon: MapPin,
      label: "Location Sharing",
      description: "Share real-time location with dispatch",
    },
    {
      id: "vibration",
      icon: Vibrate,
      label: "Vibration",
      description: "Vibrate on new dispatches",
    },
    {
      id: "autoRouting",
      icon: Globe,
      label: "Auto-Routing",
      description: "Automatically start navigation",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="bg-card border-border/30">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5" />
            Settings
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Configure your LifeLink driver preferences
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-1">
          {settingItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 px-2 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[item.id as keyof typeof settings]}
                  onCheckedChange={() => updateSetting(item.id as keyof typeof settings)}
                />
              </div>
            );
          })}
        </div>

        <Separator className="my-6 bg-border/30" />

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border/30 text-foreground hover:bg-secondary/50"
          >
            <Shield className="w-5 h-5 text-accent" />
            Privacy & Security
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-status-critical/30 text-status-critical hover:bg-status-critical/10 hover:text-status-critical"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-center text-xs text-muted-foreground">
            LifeLink Driver v1.0.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
