import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Car, AlertTriangle, CheckCircle, ArrowLeft, Printer } from "lucide-react";

interface VehicleModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function VehicleModule({ onNavigate, onLogout }: VehicleModuleProps) {
  const [form, setForm] = useState({
    patente: "", modelo: "", marca: "", tipo: "automovil",
    rut: "", pasaporte: "", plazo: "", destino: "argentina",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [tramiteId] = useState("TRX-2024-" + Math.floor(Math.random() * 900 + 100));

  const days = form.plazo ? parseInt(form.plazo) : 0;
  const overLimit = days > 180;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patente) e.patente = "Requerido";
    if (!form.modelo) e.modelo = "Requerido";
    if (!form.marca) e.marca = "Requerido";
    if (!form.rut && !form.pasaporte) e.rut = "RUT o Pasaporte requerido";
    if (!form.plazo || isNaN(parseInt(form.plazo)) || parseInt(form.plazo) < 1) e.plazo = "Plazo inválido";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader userRole="traveler" userName="Carlos Muñoz" onLogout={onLogout} onNavigate={onNavigate} currentPage="vehicle" />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-foreground mb-2" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Registro Exitoso</h2>
          <p className="text-muted-foreground text-sm mb-1">Su vehículo ha sido registrado correctamente.</p>
          <p className="text-sm mb-6">ID de Trámite: <strong className="text-primary">{tramiteId}</strong></p>
          <div className="bg-card border border-border rounded-xl p-4 text-left w-full mb-6 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground text-xs">Patente</span><p className="text-foreground">{form.patente}</p></div>
              <div><span className="text-muted-foreground text-xs">Vehículo</span><p className="text-foreground">{form.marca} {form.modelo}</p></div>
              <div><span className="text-muted-foreground text-xs">Destino</span><p className="text-foreground capitalize">{form.destino}</p></div>
              <div><span className="text-muted-foreground text-xs">Plazo</span><p className="text-foreground">{form.plazo} días</p></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 rounded-md text-sm transition-colors">
              <Printer size={15} /> Imprimir
            </button>
            <button onClick={() => onNavigate("traveler-dashboard")} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900 transition-colors">
              Volver al Panel
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole="traveler" userName="Carlos Muñoz" onLogout={onLogout} onNavigate={onNavigate} currentPage="vehicle" />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button onClick={() => onNavigate("traveler-dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Car size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Registro de Vehículos</h2>
            <p className="text-xs text-muted-foreground">Salida y Admisión Temporal — Acuerdo Chileno-Argentino</p>
          </div>
        </div>

        {overLimit && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6">
            <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-800 text-sm">El plazo ingresado supera los <strong>180 días</strong> permitidos por el Acuerdo Chileno-Argentino.</p>
              <p className="text-amber-700 text-xs mt-1">El máximo permitido es de 180 días corridos. Modifique el plazo para continuar.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Owner */}
          <div className="md:col-span-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">Propietario del Vehículo</h3>
          </div>

          {[
            { key: "rut", label: "RUT Propietario", ph: "12.345.678-9" },
            { key: "pasaporte", label: "Pasaporte (si aplica)", ph: "AB123456" },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="block text-sm text-foreground mb-1">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={ph}
                className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${errors[key] ? "border-destructive" : "border-border"}`} />
              {errors[key] && <p className="text-destructive text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          {/* Vehicle data */}
          <div className="md:col-span-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">Datos del Vehículo</h3>
          </div>

          {[
            { key: "patente", label: "Patente", ph: "ABCD12" },
            { key: "marca", label: "Marca", ph: "Toyota" },
            { key: "modelo", label: "Modelo", ph: "Corolla" },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="block text-sm text-foreground mb-1">{label}</label>
              <input value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={ph}
                className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${errors[key] ? "border-destructive" : "border-border"}`} />
              {errors[key] && <p className="text-destructive text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm text-foreground mb-1">Tipo de Vehículo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring">
              <option value="automovil">Automóvil</option>
              <option value="camioneta">Camioneta</option>
              <option value="moto">Motocicleta</option>
              <option value="bus">Bus / Minibús</option>
              <option value="camion">Camión</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-1">Destino</label>
            <select value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring">
              <option value="argentina">Argentina</option>
              <option value="peru">Perú</option>
              <option value="bolivia">Bolivia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-1">Plazo de Vigencia (días)</label>
            <input
              type="number" min="1" max="365"
              value={form.plazo} onChange={e => setForm({ ...form, plazo: e.target.value })}
              placeholder="Ej: 30"
              className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${overLimit ? "border-amber-400 bg-amber-50" : errors.plazo ? "border-destructive" : "border-border"}`}
            />
            {errors.plazo && <p className="text-destructive text-xs mt-1">{errors.plazo}</p>}
            <p className="text-xs text-muted-foreground mt-1">Máximo permitido: 180 días (Acuerdo Chileno-Argentino)</p>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => onNavigate("traveler-dashboard")} className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={overLimit} className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-5 py-2 rounded-md text-sm transition-colors disabled:opacity-50">
              <Car size={15} /> Registrar Vehículo
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
