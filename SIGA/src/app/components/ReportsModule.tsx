import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { BarChart2, Download, Calendar, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

interface ReportsModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const flowData = [
  { dia: "Lun", personas: 1240, vehiculos: 320 },
  { dia: "Mar", personas: 980, vehiculos: 270 },
  { dia: "Mié", personas: 1450, vehiculos: 410 },
  { dia: "Jue", personas: 1120, vehiculos: 295 },
  { dia: "Vie", personas: 1890, vehiculos: 520 },
  { dia: "Sáb", personas: 2340, vehiculos: 680 },
  { dia: "Dom", personas: 2100, vehiculos: 590 },
];

const monthlyData = [
  { mes: "Ene", aprobados: 4200, rechazados: 180 },
  { mes: "Feb", aprobados: 3900, rechazados: 210 },
  { mes: "Mar", aprobados: 5100, rechazados: 165 },
  { mes: "Abr", aprobados: 4700, rechazados: 195 },
  { mes: "May", aprobados: 5400, rechazados: 220 },
  { mes: "Jun", aprobados: 4900, rechazados: 175 },
];

export function ReportsModule({ onNavigate, onLogout }: ReportsModuleProps) {
  const [reportType, setReportType] = useState<"personas" | "vehiculos" | "tramites">("personas");
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-10");
  const [paso, setPaso] = useState("todos");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole="officer" userName="Inspector Soto" onLogout={onLogout} onNavigate={onNavigate} currentPage="reports" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <button onClick={() => onNavigate("officer-dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BarChart2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Reportes y Estadísticas</h2>
            <p className="text-xs text-muted-foreground">Análisis de flujo fronterizo</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm text-foreground mb-1 flex items-center gap-1"><Calendar size={13} /> Desde</label>
            <input type="date" min="1900-01-01" max="2050-12-31" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1 flex items-center gap-1"><Calendar size={13} /> Hasta</label>
            <input type="date" min="1900-01-01" max="2050-12-31" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1">Tipo de Reporte</label>
            <select value={reportType} onChange={e => setReportType(e.target.value as typeof reportType)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring">
              <option value="personas">Flujo de Personas</option>
              <option value="vehiculos">Flujo de Vehículos</option>
              <option value="tramites">Trámites Procesados</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1">Paso Fronterizo</label>
            <select value={paso} onChange={e => setPaso(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring">
              <option value="todos">Todos los pasos</option>
              <option value="libertadores">Los Libertadores</option>
              <option value="chacalluta">Chacalluta</option>
              <option value="pino-hachado">Pino Hachado</option>
            </select>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Personas", value: "11.120", delta: "+8%" },
            { label: "Total Vehículos", value: "3.085", delta: "+12%" },
            { label: "Trámites Aprobados", value: "10.620", delta: "+5%" },
            { label: "Trámites Rechazados", value: "500", delta: "-3%" },
          ].map(({ label, value, delta }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-xl text-primary" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>{value}</p>
              <p className={`text-xs mt-1 ${delta.startsWith("+") ? "text-green-600" : "text-destructive"}`}>{delta} vs semana anterior</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm text-foreground mb-4" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Flujo Semanal</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={flowData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="personas" fill="#1b2d6b" radius={[3,3,0,0]} name="Personas" />
                <Bar dataKey="vehiculos" fill="#c41230" radius={[3,3,0,0]} name="Vehículos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm text-foreground mb-4" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Tendencia Mensual</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="aprobados" stroke="#1b2d6b" strokeWidth={2} dot={false} name="Aprobados" />
                <Line type="monotone" dataKey="rechazados" stroke="#c41230" strokeWidth={2} dot={false} name="Rechazados" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-5 py-2 rounded-md text-sm transition-colors">
            <Download size={15} /> Exportar PDF
          </button>
          <button className="flex items-center gap-2 border border-border hover:bg-muted px-5 py-2 rounded-md text-sm transition-colors">
            <Download size={15} /> Exportar Excel
          </button>
        </div>
      </main>
    </div>
  );
}
