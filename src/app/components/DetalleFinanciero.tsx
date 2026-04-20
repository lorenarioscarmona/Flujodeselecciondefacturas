import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { CalculoFinanciero } from "../types/factura";
import { formatCurrency } from "../utils/formatters";
import { Tag, Percent, DollarSign } from "lucide-react";

interface DetalleFinancieroProps {
  calculo: CalculoFinanciero;
}

export function DetalleFinanciero({ calculo }: DetalleFinancieroProps) {
  return (
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
        <div className="flex items-center justify-between py-6 bg-primary/5 rounded-lg px-4">
          <div>
            <p className="font-semibold text-foreground">
              Total líquido a recibir
            </p>
          </div>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(calculo.totalLiquido)}
          </p>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> La tasa de descuento se calcula en base a
            los días promedio hasta el vencimiento de las facturas. El monto
            líquido será depositado en tu cuenta bancaria registrada dentro de
            24 a 48 horas hábiles tras la confirmación.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
