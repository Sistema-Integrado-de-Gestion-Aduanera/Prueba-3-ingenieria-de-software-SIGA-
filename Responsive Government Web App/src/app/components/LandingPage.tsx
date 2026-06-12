import { SigaLogo } from "./SigaLogo";
import { Plane, ShoppingCart, HelpCircle, LogIn, Shield, ArrowRight, Globe, FileText } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SigaLogo size={48} />
            <div>
              <p className="text-xs opacity-70 uppercase tracking-widest">Gobierno de Chile</p>
              <h1 className="text-xl leading-tight text-white" style={{fontFamily:"'Roboto Condensed', sans-serif"}}>
                Sistema Integrado de Gestión en Fronteras
              </h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Actos y Servicios</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Condiciones</a>
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-5 py-2 rounded-md transition-colors"
            >
              <LogIn size={16} />
              Iniciar Sesión
            </button>
          </nav>
          <button
            onClick={() => onNavigate("login")}
            className="md:hidden flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-md text-sm"
          >
            <LogIn size={16} />
            Sesión
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-blue-900 to-primary text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-sm mb-6 border border-white/20">
            <Shield size={14} className="text-red-300" />
            <span>Plataforma Oficial del Servicio Nacional de Aduanas</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>
            Gestión de Fronteras Digital
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma unificada para el control migratorio, declaraciones aduaneras
            y gestión de tránsitos en los pasos fronterizos de Chile.
          </p>

          {/* Main nav cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => onNavigate("traveler-dashboard")}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plane size={24} className="text-white" />
              </div>
              <h3 className="text-white mb-1" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Viajero</h3>
              <p className="text-blue-200 text-sm">Gestión de trámites, vehículos, menores y declaraciones SAG</p>
              <ArrowRight size={16} className="text-red-300 mt-3 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("purchases")}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart size={24} className="text-white" />
              </div>
              <h3 className="text-white mb-1" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Compras</h3>
              <p className="text-blue-200 text-sm">Declaración de bienes y franquicias aduaneras internacionales</p>
              <ArrowRight size={16} className="text-red-300 mt-3 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("help")}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl p-6 text-left transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle size={24} className="text-white" />
              </div>
              <h3 className="text-white mb-1" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Centro de Ayuda</h3>
              <p className="text-blue-200 text-sm">Consultas, soporte técnico y recuperación de cuenta</p>
              <ArrowRight size={16} className="text-red-300 mt-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="bg-secondary border-y border-border py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Globe, label: "Pasos habilitados", value: "47 pasos fronterizos" },
            { icon: FileText, label: "Trámites en línea", value: "Disponibles 24/7" },
            { icon: Shield, label: "Datos protegidos", value: "Plataforma segura" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="text-sm text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-primary text-white/60 text-xs py-4 px-4 text-center mt-auto">
        © 2026 Servicio Nacional de Aduanas — Gobierno de Chile · Todos los derechos reservados
      </footer>
    </div>
  );
}
