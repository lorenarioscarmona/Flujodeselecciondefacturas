import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertCircle } from "lucide-react";
import { Factura } from "../types/factura";
import { formatCurrency, formatDate, getDaysUntilDue } from "../utils/formatters";

interface FacturaTableRowProps {
  factura: Factura;
  isSelected: boolean;
  onToggle: (id: string) => void;
  isRechazada?: boolean;
}

export function FacturaTableRow({
  factura,
  isSelected,
  onToggle,
  isRechazada,
}: FacturaTableRowProps) {
  const diasVencimiento = getDaysUntilDue(factura.fechaVencimiento);

  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-muted/50 ${
        isRechazada ? "bg-destructive/5" : ""
      }`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground underline">
            {factura.numeroFactura}
          </span>
          {isRechazada && (
            <AlertCircle className="size-4 text-destructive" />
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <div className="font-medium text-foreground">
            {factura.nombreDeudor}
          </div>
          <div className="text-sm text-muted-foreground">
            {factura.rutDeudor}
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right font-medium text-foreground">
        {formatCurrency(factura.montoTotal)}
      </td>
      <td className="py-4 px-4 text-muted-foreground">
        {formatDate(factura.fechaEmision)}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {formatDate(factura.fechaVencimiento)}
          </span>
          {!isRechazada && diasVencimiento > 0 && (
            <Badge
              variant="outline"
              className={`text-xs ${diasVencimiento <= 10 ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}`}
            >
              Faltan {diasVencimiento} días
            </Badge>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onToggle(factura.id)}
          disabled={isRechazada}
          className="border border-border"
        >
          {isSelected ? "Agregado" : "Agregar"}
        </Button>
      </td>
    </tr>
  );
}