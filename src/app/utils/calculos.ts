import { Factura, CalculoFinanciero } from "../types/factura";

export function calcularFinanciamiento(facturas: Factura[]): CalculoFinanciero {
  const totalBruto = facturas.reduce((sum, f) => sum + f.montoTotal, 0);
  
  // Tasa de descuento anual: 12%
  const tasaDescuentoAnual = 0.12;
  // Promedio de días hasta vencimiento
  const diasPromedio = facturas.reduce((sum, f) => {
    const today = new Date("2026-04-15");
    const dueDate = new Date(f.fechaVencimiento);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0) / facturas.length;
  
  // Descuento por tasa proporcional a días
  const tasaDescuento = (tasaDescuentoAnual / 365) * diasPromedio;
  const descuentoPorTasa = totalBruto * tasaDescuento;
  
  // Comisión fija: 0.5%
  const comision = totalBruto * 0.005;
  
  const totalLiquido = totalBruto - descuentoPorTasa - comision;
  
  return {
    totalBruto,
    tasaDescuento: tasaDescuento * 100,
    descuentoPorTasa,
    comision,
    totalLiquido,
    facturas,
  };
}

export function simularRechazoRiesgo(factura: Factura): Factura | null {
  // Todas las facturas están disponibles - no simular rechazo
  return null;
}
