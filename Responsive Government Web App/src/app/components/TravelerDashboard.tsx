import { Users, Car, Leaf, Search, CheckCircle, XCircle, Clock, ChevronRight, CreditCard } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "./AppHeader";

interface TravelerDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const statusMock: Record<string, { label: string; status: "approved" | "rejected" | "pending" }> = {
  "TRX-2024-001": { label: "Registro Vehículo — Toyota Corolla", status: "approved" },
  "TRX-2024-002": { label: "Declaración SAG — Mascotas", status: "pending" },
  "TRX-2024-003": { label: "Gestión Menor — Valentina López", status: "rejected" },
};

export function TravelerDashboard({ onNavigate, onLogout }: TravelerDashboardProps) {
  const [tramiteId, setTramiteId] = useState("");
  const [result, setResult] = useState<null | { label: string; status: "approved" | "rejected" | "pending" }>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    setResult(statusMock[tramiteId.toUpperCase()] || null);
  };

  const modules = [
    { id: "minors", icon: Users, label: "Gestión de Menores", desc: "Validación de permisos notariales y autorizaciones de viaje", color: "bg-blue-600" },
    { id: "vehicle", icon: Car, label: "Registro de Vehículos", desc: "Acuerdo Chileno-Argentino, salida y admisión temporal", color: "bg-primary" },
    { id: "sag", icon: Leaf, label: "Declaración SAG", desc: "Productos vegetales, animales y mascotas", color: "bg-green-700" },
    { id: "purchases", icon: CreditCard, label: "Declaración de Dinero", desc: "Declaración de divisas y efectivo superior a USD 10.000", color: "bg-amber-700" },
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "approved") return <CheckCircle size={18} className="text-green-600" />;
    if (status === "rejected") return <XCircle size={18} className="text-destructive" />;
    return <Clock size={18} className="text-amber-500" />;
  };

  const statusLabel: Record<string, string> = {
    approved: "Aprobado",
    rejected: "Rechazado",
    pending: "En proceso",
  };

  const statusColor: Record<string, string> = {
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-destructive border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole="traveler" userName="Carlos Muñoz" onLogout={onLogout} onNavigate={onNavigate} currentPage="traveler-dashboard" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Bienvenido, Carlos</h2>
          <p className="text-muted-foreground text-sm mt-1">Seleccione un módulo para iniciar su trámite</p>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modules.map(({ id, icon: Icon, label, desc, color }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="group bg-card hover:shadow-lg border border-border rounded-xl p-5 text-left transition-all duration-200 hover:-translate-y-1 flex flex-col"
            >
              <div className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-sm text-foreground mb-1" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>{label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-accent">
                Iniciar <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* Status query */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base text-foreground mb-1" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Consulta de Estado de Trámite</h3>
          <p className="text-xs text-muted-foreground mb-4">Ingrese el ID de trámite recibido al momento de realizar el proceso</p>

          <div className="flex gap-2 mb-4">
            <input
              value={tramiteId}
              onChange={e => setTramiteId(e.target.value)}
              placeholder="Ej: TRX-2024-001"
              className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={handleSearch} className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <Search size={15} /> Consultar
            </button>
          </div>

          {searched && (
            result ? (
              <div className={`flex items-center gap-3 rounded-lg border p-3 ${statusColor[result.status]}`}>
                <StatusIcon status={result.status} />
                <div>
                  <p className="text-sm">{result.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">Estado: <strong>{statusLabel[result.status]}</strong></p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">No se encontró ningún trámite con ese ID. Verifique e intente nuevamente.</p>
            )
          )}

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">Trámites de prueba disponibles:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(statusMock).map(k => (
                <button key={k} onClick={() => { setTramiteId(k); setSearched(false); setResult(null); }} className="text-xs bg-secondary hover:bg-muted text-secondary-foreground px-2 py-1 rounded-md transition-colors">
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
