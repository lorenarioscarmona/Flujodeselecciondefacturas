import { createBrowserRouter } from "react-router";
import { FacturasDashboard } from "./pages/FacturasDashboard";
import { ResumenConfirmacion } from "./pages/ResumenConfirmacion";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FacturasDashboard,
  },
  {
    path: "/resumen",
    Component: ResumenConfirmacion,
  },
]);
