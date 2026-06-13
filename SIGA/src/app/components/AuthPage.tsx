import { useState, useCallback } from "react";
import { SigaLogo } from "./SigaLogo";
import { FormField } from "./FormField";
import { LogIn, UserPlus, Eye, EyeOff, ArrowLeft, Shield, User } from "lucide-react";
import {
  sanitizeRut,
  validateRut,
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validators";

interface AuthPageProps {
  onNavigate: (page: string) => void;
  onLogin: (role: "traveler" | "officer") => void;
}

interface FormState {
  id: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
  confirm: string;
}

const INITIAL_FORM: FormState = {
  id: "", password: "", name: "", lastName: "", email: "", confirm: "",
};

export function AuthPage({ onNavigate, onLogin }: AuthPageProps) {
  const [tab, setTab] = useState<"traveler" | "officer">("traveler");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);

  // useCallback ensures stable references — no new function on every render
  const handleField = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const value = field === "id" ? sanitizeRut(raw) : raw;
      setForm(prev => ({ ...prev, [field]: value }));
      // Clear error on change
      setErrors(prev => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {};

    const rutError = validateRut(form.id);
    if (rutError) e.id = rutError;

    const passError = validatePassword(form.password);
    if (passError) e.password = passError;

    if (mode === "register") {
      const nameError = validateName(form.name);
      if (nameError) e.name = nameError;

      const lastNameError = validateName(form.lastName);
      if (lastNameError) e.lastName = lastNameError;

      const emailError = validateEmail(form.email);
      if (emailError) e.email = emailError;

      if (form.password !== form.confirm)
        e.confirm = "Las contraseñas no coinciden";
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

  const switchTab = (t: "traveler" | "officer") => {
    setTab(t);
    setErrors({});
    setForm(INITIAL_FORM);
  };

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setErrors({});
    setForm(INITIAL_FORM);
  };

  const passwordHint = mode === "register"
    ? "Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo (!@#$…)"
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-900 to-primary flex flex-col items-center justify-center px-4 py-8">
      <button
        onClick={() => onNavigate("landing")}
        className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <SigaLogo size={56} className="mx-auto mb-3" />
          <p className="text-white/60 text-sm">Sistema Integrado de Gestión en Fronteras</p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          {/* User-type tabs */}
          <div className="grid grid-cols-2 border-b border-border">
            {(["traveler", "officer"] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex items-center justify-center gap-2 py-3 text-sm transition-colors ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                {t === "traveler" ? <User size={15} /> : <Shield size={15} />}
                {t === "traveler" ? "Viajero / Turista" : "Funcionario"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Login / Register sub-tabs */}
            <div className="flex gap-4 mb-5 border-b border-border">
              <button
                onClick={() => switchMode("login")}
                className={`pb-2 text-sm border-b-2 transition-colors ${
                  mode === "login"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1"><LogIn size={14} /> Iniciar Sesión</span>
              </button>
              {tab === "traveler" && (
                <button
                  onClick={() => switchMode("register")}
                  className={`pb-2 text-sm border-b-2 transition-colors ${
                    mode === "register"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1"><UserPlus size={14} /> Registrarse</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {mode === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="Nombre"
                      placeholder="Juan"
                      value={form.name}
                      onChange={handleField("name")}
                      error={errors.name}
                      autoComplete="given-name"
                    />
                    <FormField
                      label="Apellido"
                      placeholder="Pérez"
                      value={form.lastName}
                      onChange={handleField("lastName")}
                      error={errors.lastName}
                      autoComplete="family-name"
                    />
                  </div>
                  <FormField
                    label="Correo Electrónico"
                    type="email"
                    placeholder="juan@ejemplo.cl"
                    value={form.email}
                    onChange={handleField("email")}
                    error={errors.email}
                    autoComplete="email"
                    inputMode="email"
                  />
                </>
              )}

              <FormField
                label={tab === "officer" ? "RUT Funcionario" : "RUT / Pasaporte"}
                placeholder={tab === "officer" ? "123456789" : "123456789"}
                value={form.id}
                onChange={handleField("id")}
                error={errors.id}
                hint="Solo dígitos, sin puntos ni guión (9-10 caracteres)"
                inputMode="numeric"
                autoComplete="username"
                maxLength={10}
              />

              <div className="relative">
                <FormField
                  label="Contraseña"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleField("password")}
                  error={errors.password}
                  hint={passwordHint}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {mode === "register" && (
                <FormField
                  label="Confirmar Contraseña"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleField("confirm")}
                  error={errors.confirm}
                  autoComplete="new-password"
                />
              )}

              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => onNavigate("help")}
                  className="text-xs text-accent text-right hover:underline self-end"
                >
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
