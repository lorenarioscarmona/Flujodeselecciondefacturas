import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Factura } from "../types/factura";

interface FacturaRechazadaAlertProps {
  factura: Factura;
  onDismiss: () => void;
}

export function FacturaRechazadaAlert({
  factura,
  onDismiss,
}: FacturaRechazadaAlertProps) {
  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="size-4" />
      <AlertTitle>Factura rechazada por evaluación de riesgo</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-1">
          <p>
            <strong>Factura:</strong> {factura.numeroFactura} - {factura.nombreDeudor}
          </p>
          <p>
            <strong>Motivo:</strong> {factura.motivoRechazo}
          </p>
          <p className="text-sm mt-2">
            Esta factura ha sido excluida automáticamente de tu selección.
            Puedes continuar con las facturas restantes.
          </p>
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 size-6"
        onClick={onDismiss}
      >
        <X className="size-4" />
        <span className="sr-only">Cerrar</span>
      </Button>
    </Alert>
  );
}
