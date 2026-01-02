import { useState } from "react";
import { User, Lock, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DriverLoginProps {
  onLogin: (driverId: string) => void;
}

const DriverLogin = ({ onLogin }: DriverLoginProps) => {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!driverId.trim() || !password.trim()) {
      setError("Please enter both Driver ID and Password");
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo credentials: DRV001 / password123
    if (driverId === "DRV001" && password === "password123") {
      toast({
        title: "Welcome back!",
        description: `Logged in as Driver ${driverId}`,
      });
      onLogin(driverId);
    } else {
      setError("Invalid Driver ID or Password. Try DRV001 / password123");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-night p-6">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-action rounded-2xl flex items-center justify-center shadow-glow-red">
            <Truck className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-foreground mb-2">LifeLink Driver</h1>
          <p className="text-secondary-foreground/60">Sign in to start your shift</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-foreground/80">Driver ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground/40" />
              <Input
                type="text"
                placeholder="Enter your Driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="pl-12 h-14 bg-secondary border-border/30 text-secondary-foreground placeholder:text-secondary-foreground/40 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-foreground/80">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground/40" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 bg-secondary border-border/30 text-secondary-foreground placeholder:text-secondary-foreground/40 rounded-xl"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-status-critical/10 border border-status-critical/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-status-critical" />
              <p className="text-sm text-status-critical">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-action text-primary-foreground text-lg font-semibold rounded-xl hover:brightness-110 transition-all mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
          <p className="text-sm text-accent font-medium mb-1">Demo Credentials</p>
          <p className="text-xs text-secondary-foreground/60">
            Driver ID: <span className="text-accent font-mono">DRV001</span> | 
            Password: <span className="text-accent font-mono">password123</span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-secondary-foreground/40 text-sm mt-8">
          Contact dispatch if you forgot your credentials
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;
