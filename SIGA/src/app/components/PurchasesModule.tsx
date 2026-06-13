import { useState, useCallback } from "react";
import { AppHeader } from "./AppHeader";
import { ShoppingCart, ArrowLeft, AlertTriangle, CheckCircle, Plus, Trash2 } from "lucide-react";
import { validatePrice } from "../utils/validators";

interface PurchasesModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: "traveler" | "officer";
}

interface Item {
  id: string;
  descripcion: string;
  valor: number;   // stored as double-precision float
  moneda: "USD" | "CLP" | "ARS";
}

interface NewItemForm {
  descripcion: string;
  valor: string;   // string while editing, parsed on add
  moneda: "USD" | "CLP" | "ARS";
}

const INITIAL_NEW_ITEM: NewItemForm = { descripcion: "", valor: "", moneda: "USD" };

// Exchange rates (approximate, mock)
const TO_USD: Record<string, number> = { USD: 1, CLP: 1 / 950, ARS: 1 / 1050 };

const FRANQUICIA_USD = 500.00;
const CASH_THRESHOLD_USD = 10000.00;

export function PurchasesModule({ onNavigate, onLogout, userRole }: PurchasesModuleProps) {
  const [items, setItems] = useState<Item[]>([
    { id: "1", descripcion: "Ropa y calzado", valor: 150.00, moneda: "USD" },
  ]);
  const [cashUSD, setCashUSD] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>(INITIAL_NEW_ITEM);
  const [itemErrors, setItemErrors] = useState<{ descripcion?: string; valor?: string }>({});

  // Total converted to USD as double-precision float
  const totalUSD: number = items.reduce(
    (sum, i) => sum + i.valor * (TO_USD[i.moneda] ?? 1),
    0.0
  );
  const excedente: number = Math.max(0.0, totalUSD - FRANQUICIA_USD);
  const cashNum: number = parseFloat(cashUSD) || 0.0;
  const mustDeclareCash: boolean = cashNum > CASH_THRESHOLD_USD;

  const handleNewItemField = useCallback(
    (field: keyof NewItemForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setNewItem(prev => ({ ...prev, [field]: value }));
      setItemErrors(prev => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const addItem = () => {
    const errs: { descripcion?: string; valor?: string } = {};

    if (!newItem.descripcion || newItem.descripcion.trim().length === 0)
      errs.descripcion = "Campo requerido";

    const priceError = validatePrice(newItem.valor);
    if (priceError) errs.valor = priceError;

    if (Object.keys(errs).length) { setItemErrors(errs); return; }
    setItemErrors({});

    const parsed: number = parseFloat(parseFloat(newItem.valor).toFixed(10)); // double precision
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), descripcion: newItem.descripcion.trim(), valor: parsed, moneda: newItem.moneda },
    ]);
    setNewItem(INITIAL_NEW_ITEM);
  };

  const handleCashChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid float input
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setCashUSD(val);
  }, []);

  const backPage = userRole === "officer" ? "officer-dashboard" : "traveler-dashboard";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        userRole={userRole}
        userName={userRole === "officer" ? "Inspector Soto" : "Carlos Muñoz"}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="purchases"
      />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button
          onClick={() => onNavigate(backPage)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontFamily: "'Roboto Condensed',sans-serif" }}>
              Declaración de Compras y Divisas
            </h2>
            <p className="text-xs text-muted-foreground">
              Franquicia USD {FRANQUICIA_USD.toFixed(2)} por persona · Declaración obligatoria sobre USD {CASH_THRESHOLD_USD.toLocaleString("es-CL")}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 bg-card border border-border rounded-xl p-8 text-center">
            <CheckCircle size={36} className="text-green-600" />
            <h3 className="text-foreground" style={{ fontFamily: "'Roboto Condensed',sans-serif" }}>
              Declaración Enviada
            </h3>
            <p className="text-sm text-muted-foreground">
              Su declaración fue registrada. Total declarado:{" "}
              <strong>USD {totalUSD.toFixed(2)}</strong>
            </p>
            {excedente > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                Debe pagar arancel por el excedente de USD {excedente.toFixed(2)}.
                Acérquese a la ventanilla de cobros.
              </p>
            )}
            <button
              onClick={() => onNavigate(backPage)}
              className="bg-primary text-white px-5 py-2 rounded-md text-sm hover:bg-blue-900 transition-colors"
            >
              Volver al Panel
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <h3
                className="text-sm text-foreground mb-3"
                style={{ fontFamily: "'Roboto Condensed',sans-serif" }}
              >
                Bienes Adquiridos en el Exterior
              </h3>

              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-secondary rounded-lg px-3 py-2 text-sm">
                    <span className="flex-1 text-foreground">{item.descripcion}</span>
                    <span className="text-muted-foreground shrink-0">
                      {item.moneda} {item.valor.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      aria-label="Eliminar ítem"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add item row */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-start">
                <div>
                  <input
                    value={newItem.descripcion}
                    onChange={handleNewItemField("descripcion")}
                    placeholder="Descripción del bien"
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${itemErrors.descripcion ? "border-destructive" : "border-border"}`}
                  />
                  {itemErrors.descripcion && (
                    <p className="text-destructive text-xs mt-1">{itemErrors.descripcion}</p>
                  )}
                </div>

                <div>
                  <input
                    value={newItem.valor}
                    onChange={handleNewItemField("valor")}
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-28 px-3 py-2 border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring ${itemErrors.valor ? "border-destructive" : "border-border"}`}
                  />
                  {itemErrors.valor && (
                    <p className="text-destructive text-xs mt-1">{itemErrors.valor}</p>
                  )}
                </div>

                <select
                  value={newItem.moneda}
                  onChange={handleNewItemField("moneda")}
                  className="px-2 py-2 border border-border rounded-md text-sm bg-input-background outline-none h-[38px]"
                >
                  <option value="USD">USD</option>
                  <option value="CLP">CLP</option>
                  <option value="ARS">ARS</option>
                </select>

                <button
                  onClick={addItem}
                  className="flex items-center justify-center gap-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-blue-900 transition-colors h-[38px]"
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>

              {/* Total bar */}
              <div
                className={`mt-4 rounded-lg p-3 flex items-center justify-between text-sm ${
                  excedente > 0
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <span className={excedente > 0 ? "text-amber-700" : "text-green-700"}>
                  Total: USD {totalUSD.toFixed(2)}
                </span>
                {excedente > 0 ? (
                  <span className="flex items-center gap-1 text-amber-700 text-xs">
                    <AlertTriangle size={12} />
                    Excede franquicia en USD {excedente.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-green-700 text-xs">
                    Dentro de franquicia (USD {FRANQUICIA_USD.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Cash declaration */}
            <div className="bg-card border border-border rounded-xl p-5 mb-5">
              <h3
                className="text-sm text-foreground mb-3"
                style={{ fontFamily: "'Roboto Condensed',sans-serif" }}
              >
                Declaración de Dinero en Efectivo
              </h3>
              <div>
                <label className="block text-sm text-foreground mb-1">
                  Monto total en efectivo (USD o equivalente)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashUSD}
                  onChange={handleCashChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {mustDeclareCash && (
                <div className="flex items-start gap-2 mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  Transportar más de USD {CASH_THRESHOLD_USD.toLocaleString("es-CL")} en efectivo
                  requiere declaración obligatoria ante Aduana. No hacerlo puede resultar en decomiso.
                </div>
              )}
            </div>

            <button
              onClick={() => setSubmitted(true)}
              disabled={items.length === 0}
              className="w-full bg-primary hover:bg-blue-900 text-white py-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={16} /> Enviar Declaración
            </button>
          </>
        )}
      </main>
    </div>
  );
}
