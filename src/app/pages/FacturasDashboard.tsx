import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../components/ui/pagination";
import { FacturaTableRow } from "../components/FacturaTableRow";
import { FacturaRechazadaAlert } from "../components/FacturaRechazadaAlert";
import { mockFacturas } from "../data/mockFacturas";
import { Factura } from "../types/factura";
import { simularRechazoRiesgo } from "../utils/calculos";
import { formatCurrency } from "../utils/formatters";
import { FileText, ArrowRight, CheckCircle2, Search, ArrowUpDown, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

export function FacturasDashboard() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState<Factura[]>(mockFacturas);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [facturasRechazadas, setFacturasRechazadas] = useState<Factura[]>([]);
  const [alertasRechazadas, setAlertasRechazadas] = useState<Set<string>>(new Set());
  const [alertaRiesgoFactura5, setAlertaRiesgoFactura5] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("fecha_emision");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredFacturas = facturas.filter((factura) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      factura.numeroFactura.toLowerCase().includes(searchLower) ||
      factura.nombreDeudor.toLowerCase().includes(searchLower) ||
      factura.rutDeudor.toLowerCase().includes(searchLower)
    );
  });

  const sortedFacturas = [...filteredFacturas].sort((a, b) => {
    switch (sortBy) {
      case "fecha_emision":
        return new Date(a.fechaEmision).getTime() - new Date(b.fechaEmision).getTime();
      case "fecha_vencimiento":
        return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
      case "monto_alto":
        return b.montoTotal - a.montoTotal;
      case "monto_bajo":
        return a.montoTotal - b.montoTotal;
      case "factura_reciente":
        return b.numeroFactura.localeCompare(a.numeroFactura);
      case "factura_antigua":
        return a.numeroFactura.localeCompare(b.numeroFactura);
      default:
        return 0;
    }
  });

  const facturasEnPagina = sortedFacturas.slice(0, 5);

  const facturasSeleccionadas = facturas.filter((f) =>
    selectedIds.has(f.id)
  );
  const totalSeleccionado = facturasSeleccionadas.reduce(
    (sum, f) => sum + f.montoTotal,
    0
  );

  const handleToggle = (id: string) => {
    // Si es la factura 5 y se intenta agregar (no está seleccionada), mostrar alerta
    if (id === "5" && !selectedIds.has(id)) {
      setAlertaRiesgoFactura5(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const todasLasFacturas = sortedFacturas.slice(0, 5);
    // Excluir factura 5 de la selección masiva
    const facturasSeleccionables = todasLasFacturas.filter((f) => f.id !== "5");
    const todosLosIds = facturasSeleccionables.map((f) => f.id);
    const todasSeleccionadas = todosLosIds.every((id) => selectedIds.has(id));

    if (todasSeleccionadas) {
      // Quitar todas las facturas de la selección actual
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        todosLosIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    } else {
      // Agregar todas las facturas excepto la 5
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        todosLosIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  };

  const handleContinuar = () => {
    // Simular validación de riesgo
    const nuevasRechazadas: Factura[] = [];
    const nuevasSelecciones = new Set(selectedIds);

    selectedIds.forEach((id) => {
      const factura = facturas.find((f) => f.id === id);
      if (factura) {
        const rechazada = simularRechazoRiesgo(factura);
        if (rechazada) {
          nuevasRechazadas.push(rechazada);
          nuevasSelecciones.delete(id);
        }
      }
    });

    if (nuevasRechazadas.length > 0) {
      // Actualizar estado de facturas rechazadas
      setFacturas((prev) =>
        prev.map((f) => {
          const rechazada = nuevasRechazadas.find((r) => r.id === f.id);
          return rechazada || f;
        })
      );
      setFacturasRechazadas(nuevasRechazadas);
      setAlertasRechazadas(new Set(nuevasRechazadas.map((f) => f.id)));
      setSelectedIds(nuevasSelecciones);

      // Scroll al inicio para ver las alertas
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navegar a resumen si no hay rechazos
      navigate("/resumen", {
        state: { facturasSeleccionadas },
      });
    }
  };

  const handleDismissAlert = (id: string) => {
    setAlertasRechazadas((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleContinuarDespuesRechazo = () => {
    const facturasValidas = facturasSeleccionadas.filter(
      (f) => f.estado === "disponible"
    );
    navigate("/resumen", {
      state: { facturasSeleccionadas: facturasValidas },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="size-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Capital Express
                </h1>
                <p className="text-sm text-muted-foreground">
                  Portal de Factoring
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground">
                Cliente: Shiro Ltda.
              </p>
              <p className="text-sm text-foreground mt-1">
                Usuario: Lorena Ríos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alerta de riesgo para factura 5 */}
        {alertaRiesgoFactura5 && (
          <div className="mb-6">
            <Alert variant="destructive" className="relative border-2 border-red-600 bg-red-50">
              <AlertCircle className="size-4" />
              <AlertTitle>Factura no disponible para financiamiento</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-1">
                  <p>
                    La factura <strong>FAC-2026-005 - Ministerio de Transportes</strong> no puede ser agregada a tu selección.
                  </p>
                  <p>
                    <strong>Motivo:</strong> El deudor presenta indicadores de riesgo crediticio que no cumplen con nuestros criterios de evaluación.
                  </p>
                </div>
              </AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 size-6"
                onClick={() => setAlertaRiesgoFactura5(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </Alert>
          </div>
        )}

        {/* Alertas de rechazo */}
        {facturasRechazadas.length > 0 && alertasRechazadas.size > 0 && (
          <div className="space-y-4 mb-6">
            {facturasRechazadas.map((factura) =>
              alertasRechazadas.has(factura.id) ? (
                <FacturaRechazadaAlert
                  key={factura.id}
                  factura={factura}
                  onDismiss={() => handleDismissAlert(factura.id)}
                />
              ) : null
            )}
            {selectedIds.size > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Tienes {selectedIds.size} factura(s) válida(s)
                          seleccionada(s)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Puedes continuar con el proceso de factorización
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleContinuarDespuesRechazo}>
                      Continuar con facturas válidas
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Dashboard Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Facturas disponibles para financiar</CardTitle>
            <CardDescription className="mt-2">
              Agrega las factura que deseas financiar. Luego selecciona Continuar para seguir con el proceso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Buscador, Ordenador y Seleccionar todas */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Busca por N° de factura, deudor o RUT"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-20"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                  variant="outline"
                >
                  Buscar
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[280px]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="size-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fecha_emision">Ordenado por fecha de emisión</SelectItem>
                    <SelectItem value="fecha_vencimiento">Ordenado por fecha de vencimiento</SelectItem>
                    <SelectItem value="monto_alto">Ordenado por monto más alto</SelectItem>
                    <SelectItem value="monto_bajo">Ordenado por monto más bajo</SelectItem>
                    <SelectItem value="factura_reciente">Ordenado por Nº de factura más reciente</SelectItem>
                    <SelectItem value="factura_antigua">Ordenado por Nº de factura más antigua</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSelectAll}>
                  {(() => {
                    const todasLasFacturas = sortedFacturas.slice(0, 5);
                    const facturasSeleccionables = todasLasFacturas.filter((f) => f.id !== "5");
                    const todasSeleccionadas = facturasSeleccionables.every((f) => selectedIds.has(f.id));
                    return todasSeleccionadas ? "Quitar todo" : "Agregar todo";
                  })()}
                </Button>
              </div>
            </div>

            {/* Tabla de facturas */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        N° Factura
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Deudor
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Monto
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Fecha Emisión
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Fecha Vencimiento
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-foreground">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasEnPagina.map((factura) => (
                      <FacturaTableRow
                        key={factura.id}
                        factura={factura}
                        isSelected={selectedIds.has(factura.id)}
                        onToggle={handleToggle}
                        isRechazada={factura.estado === "rechazada"}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación y Botón Continuar */}
            <div className="mt-6 flex items-center justify-between">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink isActive={true}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Button
                size="lg"
                onClick={handleContinuar}
                disabled={selectedIds.size === 0}
              >
                Continuar
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}