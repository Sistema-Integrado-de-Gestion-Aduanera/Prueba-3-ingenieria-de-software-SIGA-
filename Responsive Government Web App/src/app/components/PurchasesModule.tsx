import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { ShoppingCart, ArrowLeft, AlertTriangle, CheckCircle, Plus, Trash2 } from "lucide-react";

interface PurchasesModuleProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: "traveler" | "officer";
}

interface Item {
  id: string;
  descripcion: string;
  valor: number;
  moneda: string;
}

export function PurchasesModule({ onNavigate, onLogout, userRole }: PurchasesModuleProps) {
  const [items, setItems] = useState<Item[]>([
    { id: "1", descripcion: "Ropa y calzado", valor: 150, moneda: "USD" },
  ]);
  const [cashUSD, setCashUSD] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newItem, setNewItem] = useState({ descripcion: "", valor: "", moneda: "USD" });

  const totalUSD = items.reduce((sum, i) => sum + (i.moneda === "USD" ? i.valor : i.valor / 950), 0);
  const franquicia = 500;
  const excedente = Math.max(0, totalUSD - franquicia);
  const cashNum = parseFloat(cashUSD) || 0;
  const mustDeclareCash = cashNum > 10000;

  const addItem = () => {
    if (!newItem.descripcion || !newItem.valor) return;
    setItems(prev => [...prev, { id: Date.now().toString(), ...newItem, valor: parseFloat(newItem.valor) }]);
    setNewItem({ descripcion: "", valor: "", moneda: "USD" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader userRole={userRole} userName={userRole === "officer" ? "Inspector Soto" : "Carlos Muñoz"} onLogout={onLogout} onNavigate={onNavigate} currentPage="purchases" />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button onClick={() => onNavigate(userRole === "officer" ? "officer-dashboard" : "traveler-dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Declaración de Compras y Divisas</h2>
            <p className="text-xs text-muted-foreground">Franquicia USD 500 por persona · Declaración obligatoria sobre USD 10.000</p>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 bg-card border border-border rounded-xl p-8 text-center">
            <CheckCircle size={36} className="text-green-600" />
            <h3 className="text-foreground" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Declaración Enviada</h3>
            <p className="text-sm text-muted-foreground">Su declaración fue registrada. Total declarado: <strong>USD {totalUSD.toFixed(2)}</strong></p>
            {excedente > 0 && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">Debe pagar arancel por el excedente de USD {excedente.toFixed(2)}. Acérquese a la ventanilla de cobros.</p>}
            <button onClick={() => onNavigate(userRole === "officer" ? "officer-dashboard" : "traveler-dashboard")} className="bg-primary text-white px-5 py-2 rounded-md text-sm hover:bg-blue-900 transition-colors">Volver al Panel</button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <h3 className="text-sm text-foreground mb-3" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Bienes Adquiridos en el Exterior</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-secondary rounded-lg px-3 py-2 text-sm">
                    <span className="flex-1 text-foreground">{item.descripcion}</span>
                    <span className="text-muted-foreground">{item.moneda} {item.valor.toFixed(2)}</span>
                    <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newItem.descripcion} onChange={e => setNewItem({ ...newItem, descripcion: e.target.value })}
                  placeholder="Descripción del bien" className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
                <input value={newItem.valor} onChange={e => setNewItem({ ...newItem, valor: e.target.value })}
                  type="number" placeholder="Valor" className="w-24 px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
                <select value={newItem.moneda} onChange={e => setNewItem({ ...newItem, moneda: e.target.value })}
                  className="px-2 py-2 border border-border rounded-md text-sm bg-input-background outline-none">
                  <option value="USD">USD</option>
                  <option value="CLP">CLP</option>
                  <option value="ARS">ARS</option>
                </select>
                <button onClick={addItem} className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-blue-900 transition-colors">
                  <Plus size={14} />
                </button>
              </div>

              <div className={`mt-4 rounded-lg p-3 flex items-center justify-between text-sm ${excedente > 0 ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
                <span className={excedente > 0 ? "text-amber-700" : "text-green-700"}>Total: USD {totalUSD.toFixed(2)}</span>
                {excedente > 0 ? (
                  <span className="flex items-center gap-1 text-amber-700 text-xs"><AlertTriangle size={12} /> Excede franquicia en USD {excedente.toFixed(2)}</span>
                ) : (
                  <span className="text-green-700 text-xs">Dentro de franquicia (USD {franquicia})</span>
                )}
              </div>
            </div>

            {/* Cash */}
            <div className="bg-card border border-border rounded-xl p-5 mb-5">
              <h3 className="text-sm text-foreground mb-3" style={{fontFamily:"'Roboto Condensed',sans-serif"}}>Declaración de Dinero en Efectivo</h3>
              <div>
                <label className="block text-sm text-foreground mb-1">Monto total en efectivo (USD o equivalente)</label>
                <input type="number" value={cashUSD} onChange={e => setCashUSD(e.target.value)}
                  placeholder="0.00" className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring" />
              </div>
              {mustDeclareCash && (
                <div className="flex items-start gap-2 mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  Transportar más de USD 10.000 en efectivo requiere declaración obligatoria ante Aduana. No hacerlo puede resultar en decomiso.
                </div>
              )}
            </div>

            <button onClick={() => setSubmitted(true)} className="w-full bg-primary hover:bg-blue-900 text-white py-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={16} /> Enviar Declaración
            </button>
          </>
        )}
      </main>
    </div>
  );
}
