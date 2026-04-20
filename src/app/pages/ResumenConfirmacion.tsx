import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Factura } from "../types/factura";
import { calcularFinanciamiento } from "../utils/calculos";
import { formatCurrency, formatDate } from "../utils/formatters";
import { FileText, ArrowLeft, CheckCircle, DollarSign, Percent, Tag } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";

export function ResumenConfirmacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const facturasSeleccionadas = (location.state?.facturasSeleccionadas || []) as Factura[];
  
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Si no hay facturas, redirigir al dashboard
  useEffect(() => {
    if (facturasSeleccionadas.length === 0) {
      navigate("/");
    }
  }, [facturasSeleccionadas.length, navigate]);

  // Si no hay facturas, no renderizar nada mientras se redirige
  if (facturasSeleccionadas.length === 0) {
    return null;
  }

  const calculo = calcularFinanciamiento(facturasSeleccionadas);

  const handleConfirmar = async () => {
    if (!aceptaTerminos) {
      toast.error("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccessDialog(true);
  };

  const handleVolver = () => {
    navigate("/");
  };

  const handleFinalizarExito = () => {
    setShowSuccessDialog(false);
    navigate("/");
    toast.success("Tu operación ha sido confirmada exitosamente");
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
        <Button variant="outline" onClick={handleVolver} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Volver
        </Button>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Resumen y Confirmación
          </h2>
          <p className="text-muted-foreground mt-1">
            Revisa el detalle de tu operación antes de confirmar
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Detalle Financiero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total Bruto */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted rounded-lg flex items-center justify-center">
                    <DollarSign className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Total bruto</p>
                    <p className="text-sm text-muted-foreground">
                      Suma de facturas seleccionadas
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(calculo.totalBruto)}
                </p>
              </div>

              <Separator />

              {/* Descuento por Tasa */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted rounded-lg flex items-center justify-center">
                    <Percent className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Descuento por tasa
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculo.tasaDescuento.toFixed(2)}% aplicado
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-muted-foreground">
                  -{formatCurrency(calculo.descuentoPorTasa)}
                </p>
              </div>

              <Separator />

              {/* Comisión */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted rounded-lg flex items-center justify-center">
                    <Tag className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Comisión del servicio
                    </p>
                    <p className="text-sm text-muted-foreground">0.5% del total bruto</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-muted-foreground">
                  -{formatCurrency(calculo.comision)}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Total Líquido */}
              <div className="flex items-center justify-between py-6 bg-orange-100 rounded-lg px-4">
                <div>
                  <p className="font-semibold text-black">
                    Total líquido a recibir
                  </p>
                </div>
                <p className="text-lg font-semibold text-black">
                  {formatCurrency(calculo.totalLiquido)}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Información adicional */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  • El monto será depositado en 24-48 hrs hábiles
                </p>
                <p>
                  • Recibirás un email con el comprobante de la operación
                </p>
                <p>
                  • Puedes consultar el estado en tu panel de operaciones
                </p>
              </div>

              {/* Términos y condiciones */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terminos"
                    checked={aceptaTerminos}
                    onCheckedChange={(checked) =>
                      setAceptaTerminos(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="terminos"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    Acepto los{" "}
                    <a href="#" className="text-primary underline">
                      términos y condiciones
                    </a>{" "}
                    de la operación de factoring.
                  </label>
                </div>
              </div>

              {/* Botón de confirmación */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleConfirmar}
                disabled={!aceptaTerminos || isProcessing}
              >
                {isProcessing ? "Procesando..." : "Confirmar"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="size-10 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              ¡Operación Confirmada!
            </DialogTitle>
            <DialogDescription className="text-center">
              Tu operación de factoring ha sido procesada exitosamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Operación:</span>
                <span className="font-medium text-foreground">
                  OP-{new Date().getTime().toString().slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Facturas:</span>
                <span className="font-medium text-foreground">
                  {facturasSeleccionadas.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Monto líquido:</span>
                <span className="font-bold text-primary">
                  {formatCurrency(calculo.totalLiquido)}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              El monto será depositado en tu cuenta bancaria registrada dentro
              de 24 a 48 horas hábiles.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleFinalizarExito} className="w-full">
              Volver al Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}