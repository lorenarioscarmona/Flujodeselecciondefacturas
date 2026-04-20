export interface Factura {
  id: string;
  numeroFactura: string;
  rutDeudor: string;
  nombreDeudor: string;
  montoTotal: number;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: "disponible" | "rechazada" | "procesando" | "en_revision" | "cancelada";
  motivoRechazo?: string;
}

export interface CalculoFinanciero {
  totalBruto: number;
  tasaDescuento: number;
  descuentoPorTasa: number;
  comision: number;
  totalLiquido: number;
  facturas: Factura[];
}