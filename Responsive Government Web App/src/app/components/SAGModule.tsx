import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Leaf, ArrowLeft, CheckCircle, AlertTriangle, Loader, Info } from "lucide-react";

interface SAGModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const vegetalItems = [
  { id: "frutas", label: "Frutas frescas" },
  { id: "verduras", label: "Verduras y hortalizas" },
  { id: "semillas", label: "Semillas o granos" },
  { id: "flores", label: "Flores y plantas" },
  { id: "madera", label: "Madera o productos derivados" },
];

const animalItems = [
  { id: "carne", label: "Carnes o embutidos" },
  { id: "lacteos", label: "Lácteos o huevos" },
  { id: "miel", label: "Miel o productos apícolas" },
  { id: "pescado", label: "Pescado, mariscos o crustáceos" },
];

const petItems = [
  { id: "perro", label: "Perro" },
  { id: "gato", label: "Gato" },
  { id: "ave", label: "Ave doméstica" },
  { id: "otro", label: "Otra mascota" },
];

type ProcessStatus = "idle" | "processing" | "approved" | "warning";

export function SAGModule({ onNavigate, onLogout }: SAGModuleProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [nada, setNada] = useState(false);
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");

  const anyChecked = Object.values(checked).some(Boolean);
  const hasRestricted = ["frutas", "verduras", "semillas", "carne", "miel"].some(k => checked[k]);

  const toggle = (key: string) => {
    setNada(false);
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus(hasRestricted ? "warning" : "approved");
    }, 2000);
  };

  const CheckItem = ({ id, label }: { id: string; label: string }) => (
    <label key={id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
      <input type="checkbox" checked={!!checked[id]} onChange={() => toggle(id)}
        className="w-4 h-4 accent-primary rounded" />
      <span className="text-sm text-foreground">{label}</span>
      {["frutas", "verduras", "semillas", "carne", "miel"].includes(id) && (
        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">Restricción</span>
      )}
    </label>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole="traveler" userName="Carlos Muñoz" onLogout={onLogout} onNavigate={onNavigate} currentPage="sag" />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button onClick={() => onNavigate("traveler-dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Declaración Jurada SAG</h2>
            <p className="text-xs text-muted-foreground">Servicio Agrícola y Ganadero — Productos y mascotas</p>
          </div>
        </div>

        {/* Traveler info */}
        <div className="bg-card border border-border rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground mb-1">Nombre completo</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Juan Pérez"
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-1">RUT / Pasaporte</label>
            <input value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9"
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-700 text-xs">Declara todos los productos que llevas. Omitir información puede resultar en multa. Algunos productos requieren cuarentena o serán retenidos.</p>
        </div>

        {/* Checklist sections */}
        <div className="space-y-4 mb-5">
          {[
            { title: "Productos de Origen Vegetal", items: vegetalItems, color: "text-green-700", bg: "bg-green-50" },
            { title: "Productos de Origen Animal", items: animalItems, color: "text-orange-700", bg: "bg-orange-50" },
            { title: "Mascotas", items: petItems, color: "text-blue-700", bg: "bg-blue-50" },
          ].map(({ title, items, color, bg }) => (
            <div key={title} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className={`${bg} px-4 py-3 border-b border-border`}>
                <h3 className={`text-sm ${color}`} style={{fontFamily:"'Roboto Condensed',sans-serif"}}>{title}</h3>
              </div>
              <div className="divide-y divide-border px-2">
                {items.map(item => <CheckItem key={item.id} {...item} />)}
              </div>
            </div>
          ))}
        </div>

        {/* Nada que declarar */}
        <label className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 cursor-pointer hover:bg-muted transition-colors mb-5">
          <input type="checkbox" checked={nada} onChange={e => { setNada(e.target.checked); if (e.target.checked) setChecked({}); }}
            className="w-4 h-4 accent-primary" />
          <span className="text-sm text-foreground">No tengo nada que declarar</span>
        </label>

        {/* Result */}
        {status === "processing" && (
          <div className="flex items-center justify-center gap-3 bg-card border border-border rounded-xl p-5 mb-5">
            <Loader size={20} className="text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Procesando declaración...</p>
          </div>
        )}
        {status === "approved" && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
            <CheckCircle size={24} className="text-green-600 shrink-0" />
            <div>
              <p className="text-green-800 text-sm">Declaración <strong>ACEPTADA</strong></p>
              <p className="text-green-700 text-xs mt-0.5">No se identificaron restricciones. Puede continuar.</p>
            </div>
          </div>
        )}
        {status === "warning" && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5">
            <AlertTriangle size={24} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-800 text-sm">Declaración con <strong>PRODUCTOS RESTRINGIDOS</strong></p>
              <p className="text-amber-700 text-xs mt-1">Diríjase al área de inspección SAG. Un funcionario evaluará los productos declarados.</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!anyChecked && !nada || status === "processing"}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Leaf size={16} /> Procesar Declaración (SAG)
        </button>
      </main>
    </div>
  );
}
