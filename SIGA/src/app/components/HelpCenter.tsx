import { useState, useCallback } from "react";
import { HelpCircle, Mail, Phone, KeyRound, ChevronDown, ChevronUp, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { SigaLogo } from "./SigaLogo";
import { FormField } from "./FormField";
import { validateEmail, validateName } from "../utils/validators";

interface HelpCenterProps {
  onNavigate: (page: string) => void;
  userLoggedIn?: boolean;
  onLogout?: () => void;
}

const faqs = [
  { q: "¿Cómo registro mi vehículo para salir a Argentina?", a: "Ingrese al módulo 'Registro de Vehículos' en el panel del Viajero, complete el formulario con patente, marca, modelo y plazo deseado. Recuerde que el máximo permitido es 180 días." },
  { q: "¿Qué documentos necesita un menor para salir del país?", a: "El menor debe portar cédula o pasaporte vigente. Si viaja sin ambos padres, debe presentar autorización notarial o resolución de juzgado de familia. La validación se realiza en tiempo real con PDI." },
  { q: "¿Qué productos debo declarar al SAG?", a: "Debe declarar todos los productos de origen vegetal (frutas, verduras, semillas), animal (carnes, lácteos, miel) y mascotas vivas. La omisión puede resultar en multas de hasta $500.000." },
  { q: "¿Cómo consulto el estado de mi trámite?", a: "En el Panel del Viajero encontrará la sección 'Consulta de Estado de Trámite'. Ingrese el ID recibido al procesar su trámite para ver el estado actualizado." },
  { q: "¿Puedo declarar dinero en efectivo?", a: "Si transporta más de USD 10.000 o su equivalente en moneda extranjera, debe declararlo obligatoriamente en el módulo de Declaración de Dinero antes de cruzar la frontera." },
];

export function HelpCenter({ onNavigate, userLoggedIn = false }: HelpCenterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tab, setTab] = useState<"faq" | "contact" | "recovery">("faq");
  const [contactForm, setContactForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [contactErrors, setContactErrors] = useState<{ nombre?: string; email?: string; asunto?: string }>({});
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryEmailError, setRecoveryEmailError] = useState("");
  const [sent, setSent] = useState(false);
  const [recovered, setRecovered] = useState(false);

  const handleContactField = useCallback(
    (field: keyof typeof contactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContactForm(prev => ({ ...prev, [field]: e.target.value }));
      setContactErrors(prev => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof contactErrors = {};
    const nameErr = validateName(contactForm.nombre);
    if (nameErr) errs.nombre = nameErr;
    const emailErr = validateEmail(contactForm.email);
    if (emailErr) errs.email = emailErr;
    const asuntoErr = validateName(contactForm.asunto);
    if (asuntoErr) errs.asunto = asuntoErr;
    if (Object.keys(errs).length) { setContactErrors(errs); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="bg-primary text-white px-4 py-3 flex items-center gap-3 shadow">
        <SigaLogo size={36} />
        <span className="text-sm" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>SIGA — Centro de Ayuda</span>
        <div className="ml-auto">
          {userLoggedIn ? (
            <button onClick={() => onNavigate("traveler-dashboard")} className="text-white/70 hover:text-white text-sm flex items-center gap-1">
              <ArrowLeft size={14} /> Volver
            </button>
          ) : (
            <button onClick={() => onNavigate("landing")} className="text-white/70 hover:text-white text-sm flex items-center gap-1">
              <ArrowLeft size={14} /> Inicio
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <HelpCircle size={24} className="text-primary" />
          </div>
          <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>¿En qué podemos ayudarle?</h2>
          <p className="text-muted-foreground text-sm mt-1">Encuentre respuestas rápidas o contáctenos directamente</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6">
          {([
            { id: "faq", label: "Preguntas Frecuentes", icon: HelpCircle },
            { id: "contact", label: "Contacto", icon: Mail },
            { id: "recovery", label: "Recuperar Cuenta", icon: KeyRound },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm transition-colors ${tab === id ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* FAQ */}
        {tab === "faq" && (
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-muted transition-colors">
                  <span className="text-sm text-foreground pr-3">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t border-border bg-secondary/30">
                    <p className="leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        {tab === "contact" && (
          <div className="space-y-5">
            {/* Phone */}
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Phone size={18} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm text-foreground">Atención Telefónica</p>
                <p className="text-lg text-primary" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>600 748 2000</p>
                <p className="text-xs text-muted-foreground">Lunes a Viernes 8:00 – 20:00 hrs · Sábados 9:00 – 14:00 hrs</p>
              </div>
            </div>

            {/* Contact form */}
            {sent ? (
              <div className="flex flex-col items-center gap-3 bg-card border border-border rounded-xl p-8 text-center">
                <CheckCircle size={32} className="text-green-600" />
                <p className="text-foreground text-sm">Su consulta fue enviada correctamente. Recibirá respuesta en su correo en 24-48 horas hábiles.</p>
                <button onClick={() => setSent(false)} className="text-primary text-sm hover:underline">Enviar otra consulta</button>
              </div>
            ) : (
              <form onSubmit={handleContact} noValidate className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-sm text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Formulario de Contacto</h3>
                <FormField
                  label="Nombre"
                  placeholder="Juan Pérez"
                  value={contactForm.nombre}
                  onChange={handleContactField("nombre")}
                  error={contactErrors.nombre}
                  autoComplete="name"
                />
                <FormField
                  label="Correo Electrónico"
                  type="email"
                  placeholder="juan@ejemplo.cl"
                  value={contactForm.email}
                  onChange={handleContactField("email")}
                  error={contactErrors.email}
                  autoComplete="email"
                  inputMode="email"
                />
                <FormField
                  label="Asunto"
                  placeholder="Consulta sobre trámite"
                  value={contactForm.asunto}
                  onChange={handleContactField("asunto")}
                  error={contactErrors.asunto}
                />
                <div>
                  <label className="block text-sm text-foreground mb-1">Mensaje</label>
                  <textarea
                    value={contactForm.mensaje}
                    onChange={handleContactField("mensaje")}
                    placeholder="Describa su consulta o problema..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-border text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-5 py-2 rounded-md text-sm transition-colors">
                  <Send size={14} /> Enviar Consulta
                </button>
              </form>
            )}
          </div>
        )}

        {/* Recovery */}
        {tab === "recovery" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm text-foreground mb-1" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Recuperar Contraseña</h3>
            <p className="text-xs text-muted-foreground mb-5">Ingrese el correo asociado a su cuenta. Le enviaremos un código de verificación.</p>

            {recovered ? (
              <div className="flex flex-col items-center gap-3 text-center py-4">
                <CheckCircle size={32} className="text-green-600" />
                <p className="text-sm text-foreground">Se ha enviado un código de recuperación a <strong>{recoveryEmail}</strong></p>
                <p className="text-xs text-muted-foreground">Revise su bandeja de entrada. El código expira en 15 minutos.</p>
                <button onClick={() => { setRecovered(false); setRecoveryEmail(""); }} className="text-primary text-sm hover:underline">Intentar con otro correo</button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const err = validateEmail(recoveryEmail);
                  if (err) { setRecoveryEmailError(err); return; }
                  setRecoveryEmailError("");
                  setRecovered(true);
                }}
                noValidate
                className="flex flex-col gap-4"
              >
                <FormField
                  label="Correo Electrónico"
                  type="email"
                  placeholder="juan@ejemplo.cl"
                  value={recoveryEmail}
                  onChange={e => { setRecoveryEmail(e.target.value); setRecoveryEmailError(""); }}
                  error={recoveryEmailError}
                  autoComplete="email"
                  inputMode="email"
                />
                <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-5 py-2 rounded-md text-sm transition-colors w-fit">
                  <KeyRound size={14} /> Enviar Código de Recuperación
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      <footer className="bg-primary text-white/50 text-xs py-3 px-4 text-center">
        © 2026 Servicio Nacional de Aduanas — Gobierno de Chile
      </footer>
    </div>
  );
}
