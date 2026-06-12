import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { TravelerDashboard } from "./components/TravelerDashboard";
import { VehicleModule } from "./components/VehicleModule";
import { MinorsModule } from "./components/MinorsModule";
import { SAGModule } from "./components/SAGModule";
import { OfficerDashboard } from "./components/OfficerDashboard";
import { ReportsModule } from "./components/ReportsModule";
import { HelpCenter } from "./components/HelpCenter";
import { PurchasesModule } from "./components/PurchasesModule";

type Page =
  | "landing"
  | "login"
  | "traveler-dashboard"
  | "vehicle"
  | "minors"
  | "sag"
  | "purchases"
  | "officer-dashboard"
  | "reports"
  | "help";

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [userRole, setUserRole] = useState<"traveler" | "officer" | null>(null);

  const navigate = (p: string) => setPage(p as Page);

  const handleLogin = (role: "traveler" | "officer") => {
    setUserRole(role);
    navigate(role === "traveler" ? "traveler-dashboard" : "officer-dashboard");
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate("landing");
  };

  if (page === "landing") return <LandingPage onNavigate={navigate} />;
  if (page === "login") return <AuthPage onNavigate={navigate} onLogin={handleLogin} />;
  if (page === "help") return <HelpCenter onNavigate={navigate} userLoggedIn={userRole !== null} />;

  if (page === "traveler-dashboard")
    return <TravelerDashboard onNavigate={navigate} onLogout={handleLogout} />;
  if (page === "vehicle")
    return <VehicleModule onNavigate={navigate} onLogout={handleLogout} />;
  if (page === "minors")
    return <MinorsModule onNavigate={navigate} onLogout={handleLogout} />;
  if (page === "sag")
    return <SAGModule onNavigate={navigate} onLogout={handleLogout} />;
  if (page === "purchases")
    return <PurchasesModule onNavigate={navigate} onLogout={handleLogout} userRole={userRole ?? "traveler"} />;
  if (page === "officer-dashboard")
    return <OfficerDashboard onNavigate={navigate} onLogout={handleLogout} />;
  if (page === "reports")
    return <ReportsModule onNavigate={navigate} onLogout={handleLogout} />;

  return <LandingPage onNavigate={navigate} />;
}
