import { SigaLogo } from "./SigaLogo";
import { LogOut, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AppHeaderProps {
  userRole: "traveler" | "officer";
  userName?: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const travelerNavItems = [
  { id: "traveler-dashboard", label: "Panel" },
  { id: "vehicle", label: "Vehículos" },
  { id: "minors", label: "Menores" },
  { id: "sag", label: "SAG" },
  { id: "help", label: "Ayuda" },
];

const officerNavItems = [
  { id: "officer-dashboard", label: "Panel Control" },
  { id: "reports", label: "Reportes" },
  { id: "help", label: "Ayuda" },
];

export function AppHeader({ userRole, userName, onLogout, onNavigate, currentPage }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = userRole === "traveler" ? travelerNavItems : officerNavItems;

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(userRole === "traveler" ? "traveler-dashboard" : "officer-dashboard")}>
          <SigaLogo size={36} />
          <span className="hidden sm:block text-sm opacity-80" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>SIGA — Gobierno de Chile</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${currentPage === item.id ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-sm text-white/80 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-md transition-colors">
              <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-xs font-semibold">
                {userName ? userName[0].toUpperCase() : "U"}
              </div>
              <span className="hidden sm:block">{userName || (userRole === "officer" ? "Funcionario" : "Viajero")}</span>
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl w-44 py-1 z-50">
                <p className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                  {userRole === "officer" ? "Funcionario" : "Viajero"}
                </p>
                <button onClick={() => { setMenuOpen(false); onLogout(); }} className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted flex items-center gap-2 transition-colors">
                  <LogOut size={14} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden bg-primary/95 border-t border-white/10 px-4 pb-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { onNavigate(item.id); setMenuOpen(false); }} className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${currentPage === item.id ? "bg-white/20 text-white" : "text-white/70"}`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
