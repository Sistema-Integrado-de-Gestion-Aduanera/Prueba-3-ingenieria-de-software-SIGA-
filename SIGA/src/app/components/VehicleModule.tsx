import { useState, useCallback } from "react";
import { AppHeader } from "./AppHeader";
import { FormField } from "./FormField";
import { Car, AlertTriangle, CheckCircle, ArrowLeft, Printer } from "lucide-react";
import { sanitizeRut, validateRut, validateName } from "../utils/validators";

interface VehicleModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface VehicleForm {
  patente: string;
  modelo: string;
  marca: string;
  tipo: string;
  rut: string;
  pasaporte: string;
  plazo: string;
  destino: string;
}

const INITIAL_FORM: VehicleForm = {
  patente: "", modelo: "", marca: "", tipo: "automovil",
  rut: "", pasaporte: "", plazo: "", destino: "argentina",
};

export function VehicleModule({ onNavigate, onLogout }: VehicleModuleProps) {
  const [form, setForm] = useState<VehicleForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<VehicleForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [tramiteId] = useState("TRX-2024-" + Math.floor(Math.random() * 900 + 100));

  const days = form.plazo ? parseInt(form.plazo) : 0;
  const overLimit = days > 180;

  const handleField = useCallback(
    (field: keyof VehicleForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = e.target.value;
      if (field === "rut") value = sanitizeRut(value);
      // Patente: uppercase, alphanumeric only, max 8 chars
      if (field === "patente") value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      setForm(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validate = (): Partial<VehicleForm> => {
    const e: Partial<VehicleForm> = {};

    if (!form.patente || form.patente.trim().length === 0) e.patente = "Campo requerido";

    const marcaErr = validateName(form.marca);
    if (marcaErr) e.marca = marcaErr;

    const modeloErr = validateName(form.modelo);
    if (modeloErr) e.modelo = modeloErr;

    if (!form.rut && !form.pasaporte) e.rut = "RUT o Pasaporte requerido";
    else if (form.rut) {
      const rutErr = validateRut(form.rut);
      if (rutErr) e.rut = rutErr;
    }

    const plazoNum = parseInt(form.plazo);
    if (!form.plazo || isNaN(plazoNum) || plazoNum < 1) e.plazo = "Ingrese un plazo válido (días)";
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
          <h2 className="text-foreground mb-2" style={{ fontFamily: "'Roboto Condensed',sans-serif" }}>
            Registro Exitoso
          </h2>
          <p className="text-muted-foreground text-sm mb-1">Su vehículo ha sido registrado correctamente.</p>
          <p className="text-sm mb-6">
            ID de Trámite: <strong className="text-primary">{tramiteId}</strong>
          </p>
          <div className="bg-card border border-border rounded-xl p-4 text-left w-full mb-6 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-muted-foreground text-xs">Patente</span><p className="text-foreground">{form.patente}</p></div>
              <div><span className="text-muted-foreground text-xs">Vehículo</span><p className="text-foreground">{form.marca} {form.modelo}</p></div>
              <div><span className="text-muted-foreground text-xs">Destino</span><p className="text-foreground capitalize">{form.destino}</p></div>
              <div><span className="text-muted-foreground text-xs">Plazo</span><p className="text-foreground">{form.plazo} días</p></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 rounded-md text-sm transition-colors"
            >
              <Printer size={15} /> Imprimir
            </button>
            <button
              onClick={() => onNavigate("traveler-dashboard")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900 transition-colors"
            >
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
        <button
          onClick={() => onNavigate("traveler-dashboard")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Car size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontFamily: "'Roboto Condensed',sans-serif" }}>
              Registro de Vehículos
            </h2>
            <p className="text-xs text-muted-foreground">
              Salida y Admisión Temporal — Acuerdo Chileno-Argentino
            </p>
          </div>
        </div>

        {overLimit && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6">
            <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-800 text-sm">
                El plazo ingresado supera los <strong>180 días</strong> permitidos por el Acuerdo Chileno-Argentino.
              </p>
              <p className="text-amber-700 text-xs mt-1">Modifique el plazo para continuar.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Owner section */}
          <div className="md:col-span-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
              Propietario del Vehículo
            </h3>
          </div>

          <FormField
            label="RUT Propietario"
            placeholder="123456789"
            value={form.rut}
            onChange={handleField("rut")}
            error={errors.rut}
            hint="Solo dígitos, sin puntos ni guión (9-10 caracteres)"
            inputMode="numeric"
            maxLength={10}
          />
          <FormField
            label="Pasaporte (si aplica)"
            placeholder="AB123456"
            value={form.pasaporte}
            onChange={handleField("pasaporte")}
            error={errors.pasaporte}
            autoComplete="off"
          />

          {/* Vehicle section */}
          <div className="md:col-span-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
              Datos del Vehículo
            </h3>
          </div>

          <FormField
            label="Patente"
            placeholder="ABCD12"
            value={form.patente}
            onChange={handleField("patente")}
            error={errors.patente}
            maxLength={8}
          />
          <FormField
            label="Marca"
            placeholder="Toyota"
            value={form.marca}
            onChange={handleField("marca")}
            error={errors.marca}
          />
          <FormField
            label="Modelo"
            placeholder="Corolla"
            value={form.modelo}
            onChange={handleField("modelo")}
            error={errors.modelo}
          />

          <div>
            <label className="block text-sm text-foreground mb-1">Tipo de Vehículo</label>
            <select
              value={form.tipo}
              onChange={handleField("tipo")}
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="automovil">Automóvil</option>
              <option value="camioneta">Camioneta</option>
              <option value="moto">Motocicleta</option>
              <option value="bus">Bus / Minibús</option>
              <option value="camion">Camión</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-1">Destino</label>
            <select
              value={form.destino}
              onChange={handleField("destino")}
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="argentina">Argentina</option>
              <option value="peru">Perú</option>
              <option value="bolivia">Bolivia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground mb-1">Plazo de Vigencia (días)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={form.plazo}
              onChange={handleField("plazo")}
              placeholder="Ej: 30"
              className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${
                overLimit
                  ? "border-amber-400 bg-amber-50"
                  : errors.plazo
                  ? "border-destructive"
                  : "border-border"
              }`}
            />
            {errors.plazo && <p className="text-destructive text-xs mt-1">{errors.plazo}</p>}
            <p className="text-xs text-muted-foreground mt-1">Máximo permitido: 180 días (Acuerdo Chileno-Argentino)</p>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate("traveler-dashboard")}
              className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={overLimit}
              className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-5 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              <Car size={15} /> Registrar Vehículo
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
