import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Shield, CheckCircle, XCircle, Printer, Search, Clock, AlertCircle, User, Car, ChevronRight, Activity } from "lucide-react";

interface OfficerDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

type FlowStatus = "pendiente" | "aprobado" | "rechazado" | "inspeccion";

interface TravelFlow {
  id: string;
  nombre: string;
  rut: string;
  tipo: string;
  paso: string;
  hora: string;
  status: FlowStatus;
  modulo: string;
}

const mockFlows: TravelFlow[] = [
  { id: "TRX-001", nombre: "María González", rut: "15.234.567-8", tipo: "Entrada", paso: "Los Libertadores", hora: "09:12", status: "pendiente", modulo: "Vehículo" },
  { id: "TRX-002", nombre: "Pedro Castillo", rut: "12.456.789-0", tipo: "Salida", paso: "Chacalluta", hora: "09:45", status: "inspeccion", modulo: "SAG" },
  { id: "TRX-003", nombre: "Ana Martínez", rut: "16.789.012-3", tipo: "Entrada", paso: "Pino Hachado", hora: "10:02", status: "aprobado", modulo: "Menor" },
  { id: "TRX-004", nombre: "Carlos Fuentes", rut: "11.345.678-K", tipo: "Salida", paso: "Los Libertadores", hora: "10:18", status: "pendiente", modulo: "Vehículo" },
  { id: "TRX-005", nombre: "Valentina Ríos", rut: "18.901.234-5", tipo: "Entrada", paso: "Chacalluta", hora: "10:33", status: "rechazado", modulo: "PDI" },
];

const statusConfig: Record<FlowStatus, { label: string; color: string; icon: React.ElementType }> = {
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  rechazado: { label: "Rechazado", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  inspeccion: { label: "En Inspección", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Search },
};

export function OfficerDashboard({ onNavigate, onLogout }: OfficerDashboardProps) {
  const [flows, setFlows] = useState(mockFlows);
  const [selected, setSelected] = useState<TravelFlow | null>(null);
  const [filterStatus, setFilterStatus] = useState<FlowStatus | "all">("all");
  const [search, setSearch] = useState("");
  const officerRut = "9.876.543-2";

  const filtered = flows.filter(f =>
    (filterStatus === "all" || f.status === filterStatus) &&
    (search === "" || f.nombre.toLowerCase().includes(search.toLowerCase()) || f.rut.includes(search) || f.id.includes(search.toUpperCase()))
  );

  const updateStatus = (id: string, status: FlowStatus) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const stats = {
    total: flows.length,
    aprobados: flows.filter(f => f.status === "aprobado").length,
    pendientes: flows.filter(f => f.status === "pendiente").length,
    rechazados: flows.filter(f => f.status === "rechazado").length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole="officer" userName="Inspector Soto" onLogout={onLogout} onNavigate={onNavigate} currentPage="officer-dashboard" />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Officer badge */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Panel de Control — Funcionario</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <User size={12} /> RUT Operador: <strong>{officerRut}</strong> — Paso Los Libertadores
            </p>
          </div>
          <div className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 rounded-full px-3 py-1 text-xs">
            <Activity size={12} /> Sesión activa
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Tránsitos", value: stats.total, color: "text-primary", bg: "bg-primary/10" },
            { label: "Aprobados", value: stats.aprobados, color: "text-green-700", bg: "bg-green-100" },
            { label: "Pendientes", value: stats.pendientes, color: "text-amber-700", bg: "bg-amber-100" },
            { label: "Rechazados", value: stats.rechazados, color: "text-destructive", bg: "bg-red-100" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                <span className={`text-lg ${color}`}>{value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm transition-colors">
            <Shield size={15} /> Validar Antecedentes (PDI)
          </button>
          <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm transition-colors">
            <CheckCircle size={15} /> Aprobar Ingreso/Salida
          </button>
          <button className="flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 rounded-md text-sm transition-colors">
            <Printer size={15} /> Imprimir Formulario
          </button>
          <button onClick={() => onNavigate("reports")} className="flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 rounded-md text-sm transition-colors">
            <Activity size={15} /> Ver Reportes
          </button>
        </div>

        <div className={`grid gap-4 ${selected ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {/* Flow list */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, RUT o ID..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md bg-card outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as FlowStatus | "all")}
                className="text-sm border border-border rounded-md px-2 py-1.5 bg-card outline-none">
                <option value="all">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
                <option value="inspeccion">En Inspección</option>
              </select>
            </div>

            <div className="divide-y divide-border">
              {filtered.map(flow => {
                const { label, color, icon: Icon } = statusConfig[flow.status];
                return (
                  <div key={flow.id} onClick={() => setSelected(flow === selected ? null : flow)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors ${selected?.id === flow.id ? "bg-muted" : ""}`}>
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      {flow.modulo === "Vehículo" ? <Car size={14} className="text-muted-foreground" /> : <User size={14} className="text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{flow.nombre}</p>
                      <p className="text-xs text-muted-foreground">{flow.id} · {flow.tipo} · {flow.hora}</p>
                    </div>
                    <span className={`text-xs border rounded-full px-2 py-0.5 flex items-center gap-1 shrink-0 ${color}`}>
                      <Icon size={10} /> {label}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">Sin resultados</div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Detalle del Tránsito</h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">×</button>
              </div>

              <div className="space-y-3 mb-5 text-sm">
                {[
                  { label: "ID Trámite", value: selected.id },
                  { label: "Nombre", value: selected.nombre },
                  { label: "RUT", value: selected.rut },
                  { label: "Tipo", value: selected.tipo },
                  { label: "Paso Fronterizo", value: selected.paso },
                  { label: "Módulo", value: selected.modulo },
                  { label: "Hora", value: selected.hora },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-muted rounded-lg p-3 mb-5 flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                La supervisión humana es obligatoria antes de la aprobación final según protocolo SIGA-2024.
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => updateStatus(selected.id, "aprobado")} className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 rounded-md text-sm transition-colors">
                  <CheckCircle size={15} /> Aprobar Ingreso/Salida
                </button>
                <button onClick={() => updateStatus(selected.id, "inspeccion")} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-900 text-white py-2 rounded-md text-sm transition-colors">
                  <Shield size={15} /> Enviar a Inspección
                </button>
                <button onClick={() => updateStatus(selected.id, "rechazado")} className="w-full flex items-center justify-center gap-2 bg-destructive hover:bg-red-800 text-white py-2 rounded-md text-sm transition-colors">
                  <XCircle size={15} /> Rechazar
                </button>
                <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 border border-border hover:bg-muted py-2 rounded-md text-sm transition-colors">
                  <Printer size={15} /> Imprimir Formulario
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
