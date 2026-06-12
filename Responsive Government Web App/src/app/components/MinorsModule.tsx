import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Users, Camera, Upload, CheckCircle, XCircle, Loader, ArrowLeft, FileText, AlertCircle } from "lucide-react";

interface MinorsModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

type PDIStatus = "idle" | "validating" | "approved" | "rejected";

export function MinorsModule({ onNavigate, onLogout }: MinorsModuleProps) {
  const [form, setForm] = useState({ nombre: "", apellido: "", rut: "", pasaporte: "", fecNac: "", docType: "notarial" });
  const [files, setFiles] = useState<File[]>([]);
  const [pdiStatus, setPdiStatus] = useState<PDIStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre) e.nombre = "Requerido";
    if (!form.apellido) e.apellido = "Requerido";
    if (!form.rut && !form.pasaporte) e.rut = "RUT o Pasaporte requerido";
    if (!form.fecNac) e.fecNac = "Requerido";
    return e;
  };

  const handleValidate = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setPdiStatus("validating");
    setTimeout(() => {
      setPdiStatus(Math.random() > 0.25 ? "approved" : "rejected");
    }, 2800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole="traveler" userName="Carlos Muñoz" onLogout={onLogout} onNavigate={onNavigate} currentPage="minors" />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button onClick={() => onNavigate("traveler-dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Gestión de Menores</h2>
            <p className="text-xs text-muted-foreground">Integración PDI — Validación de permisos notariales</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-800 text-sm">Los menores de 18 años que viajan sin ambos padres requieren autorización notarial o de juzgado para salir del país.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-5">
          <h3 className="text-sm text-foreground mb-4 pb-2 border-b border-border" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Datos del Menor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "nombre", label: "Nombre" },
              { key: "apellido", label: "Apellido" },
              { key: "rut", label: "RUT (si tiene)", ph: "12.345.678-9" },
              { key: "pasaporte", label: "N° Pasaporte", ph: "AB123456" },
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
              <label className="block text-sm text-foreground mb-1">Fecha de Nacimiento</label>
              <input type="date" value={form.fecNac} onChange={e => setForm({ ...form, fecNac: e.target.value })}
                className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${errors.fecNac ? "border-destructive" : "border-border"}`} />
              {errors.fecNac && <p className="text-destructive text-xs mt-1">{errors.fecNac}</p>}
            </div>
          </div>
        </div>

        {/* Document upload */}
        <div className="bg-card border border-border rounded-xl p-6 mb-5">
          <h3 className="text-sm text-foreground mb-4 pb-2 border-b border-border" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Documentos de Autorización</h3>

          <div className="mb-3">
            <label className="block text-sm text-foreground mb-1">Tipo de Documento</label>
            <select value={form.docType} onChange={e => setForm({ ...form, docType: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring">
              <option value="notarial">Autorización Notarial</option>
              <option value="juzgado">Autorización de Juzgado de Familia</option>
              <option value="ambos">Viaja con Ambos Padres</option>
              <option value="tutor">Viaja con Tutor Legal</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById("file-upload")?.click()}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Upload size={18} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground">Subir documentos (PDF, JPG, PNG)</p>
              <p className="text-xs text-muted-foreground">Hasta 10MB por archivo</p>
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map(f => (
                    <span key={f.name} className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
                      <FileText size={12} /> {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <input id="file-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="flex gap-3 mt-3">
            <button className="flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 rounded-md text-sm transition-colors">
              <Camera size={15} /> Escanear Documento
            </button>
          </div>
        </div>

        {/* PDI Validation */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm text-foreground mb-3" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Validación PDI</h3>

          {pdiStatus === "idle" && (
            <button onClick={handleValidate} className="w-full bg-primary hover:bg-blue-900 text-white py-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
              <Users size={16} /> Validar Antecedentes (PDI)
            </button>
          )}

          {pdiStatus === "validating" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader size={32} className="text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Validando antecedentes con PDI...</p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{width: "60%"}} />
              </div>
            </div>
          )}

          {pdiStatus === "approved" && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle size={24} className="text-green-600 shrink-0" />
              <div>
                <p className="text-green-800 text-sm">Antecedentes verificados — <strong>APROBADO</strong></p>
                <p className="text-green-700 text-xs mt-0.5">El menor puede continuar con el proceso de salida.</p>
              </div>
            </div>
          )}

          {pdiStatus === "rejected" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <XCircle size={24} className="text-destructive shrink-0" />
                <div>
                  <p className="text-red-800 text-sm">Validación <strong>RECHAZADA</strong></p>
                  <p className="text-red-700 text-xs mt-0.5">Se encontraron inconsistencias en los antecedentes. Contacte al funcionario.</p>
                </div>
              </div>
              <button onClick={() => setPdiStatus("idle")} className="text-sm text-primary hover:underline text-left">
                Intentar nuevamente
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
