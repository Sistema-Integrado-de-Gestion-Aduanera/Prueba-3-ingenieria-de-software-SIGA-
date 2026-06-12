import { useState } from "react";
import { SigaLogo } from "./SigaLogo";
import { LogIn, UserPlus, Eye, EyeOff, ArrowLeft, Shield, User } from "lucide-react";

interface AuthPageProps {
  onNavigate: (page: string) => void;
  onLogin: (role: "traveler" | "officer") => void;
}

export function AuthPage({ onNavigate, onLogin }: AuthPageProps) {
  const [tab, setTab] = useState<"traveler" | "officer">("traveler");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ id: "", password: "", name: "", lastName: "", email: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.id) e.id = "Campo requerido";
    if (!form.password || form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (mode === "register") {
      if (!form.name) e.name = "Campo requerido";
      if (!form.lastName) e.lastName = "Campo requerido";
      if (!form.email || !form.email.includes("@")) e.email = "Correo inválido";
      if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(tab);
    }, 1200);
  };

  const Field = ({ id, label, type = "text", placeholder }: { id: keyof typeof form; label: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm text-foreground mb-1">{label}</label>
      <input
        type={id === "password" || id === "confirm" ? (showPass ? "text" : "password") : type}
        value={form[id]}
        onChange={e => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-md border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring transition-all ${errors[id] ? "border-destructive" : "border-border"}`}
      />
      {errors[id] && <p className="text-destructive text-xs mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-900 to-primary flex flex-col items-center justify-center px-4 py-8">
      <button onClick={() => onNavigate("landing")} className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm transition-colors">
        <ArrowLeft size={16} /> Volver al inicio
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <SigaLogo size={56} className="mx-auto mb-3" />
          <p className="text-white/60 text-sm">Sistema Integrado de Gestión en Fronteras</p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          {/* User type tabs */}
          <div className="grid grid-cols-2 border-b border-border">
            {(["traveler", "officer"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); }}
                className={`flex items-center justify-center gap-2 py-3 text-sm transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"}`}
              >
                {t === "traveler" ? <User size={15} /> : <Shield size={15} />}
                {t === "traveler" ? "Viajero / Turista" : "Funcionario"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Login / Register sub-tabs */}
            <div className="flex gap-4 mb-5 border-b border-border">
              <button onClick={() => { setMode("login"); setErrors({}); }} className={`pb-2 text-sm border-b-2 transition-colors ${mode === "login" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <span className="flex items-center gap-1"><LogIn size={14} /> Iniciar Sesión</span>
              </button>
              {tab === "traveler" && (
                <button onClick={() => { setMode("register"); setErrors({}); }} className={`pb-2 text-sm border-b-2 transition-colors ${mode === "register" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  <span className="flex items-center gap-1"><UserPlus size={14} /> Registrarse</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field id="name" label="Nombre" placeholder="Juan" />
                    <Field id="lastName" label="Apellido" placeholder="Pérez" />
                  </div>
                  <Field id="email" label="Correo Electrónico" type="email" placeholder="juan@ejemplo.cl" />
                </>
              )}
              <Field id="id" label={tab === "officer" ? "RUT Funcionario" : "RUT / Pasaporte"} placeholder={tab === "officer" ? "12.345.678-9" : "12.345.678-9 o AB123456"} />
              <div className="relative">
                <Field id="password" label="Contraseña" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === "register" && <Field id="confirm" label="Confirmar Contraseña" placeholder="••••••••" />}

              {mode === "login" && (
                <button type="button" onClick={() => onNavigate("help")} className="text-xs text-accent text-right hover:underline">
                  ¿Olvidó su contraseña?
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-900 text-primary-foreground py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : mode === "login" ? (
                  <><LogIn size={16} /> Ingresar al Sistema</>
                ) : (
                  <><UserPlus size={16} /> Crear Cuenta</>
                )}
              </button>
            </form>

            {tab === "officer" && (
              <p className="mt-4 text-xs text-muted-foreground text-center bg-muted rounded p-2">
                Acceso restringido a personal autorizado del SAG, PDI y Aduana.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
