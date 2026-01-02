import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import PatientPortal from "@/components/patient/PatientPortal";
import DriverDashboard from "@/components/driver/DriverDashboard";
import HospitalAdmin from "@/components/hospital/HospitalAdmin";
import ControlCenter from "@/components/control/ControlCenter";

const Index = () => {
  const [currentView, setCurrentView] = useState("control");

  const renderView = () => {
    switch (currentView) {
      case "patient":
        return <PatientPortal />;
      case "driver":
        return <DriverDashboard />;
      case "hospital":
        return <HospitalAdmin />;
      case "control":
        return <ControlCenter />;
      default:
        return <ControlCenter />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader currentView={currentView} />
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-hidden bg-muted/30">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Index;
