import { Suspense, lazy } from "react"
import { Route, Routes } from "react-router"
import { Home } from "../home/home"
import QuienesSomos from "../aboutUs/AboutUs"
import ProductPage from "../product/ProductPage"
import Contacto from "../contact/Contact"
import SimpleProtectedRoute from "../components/SimpleProtectedRoute"
import ResetPasswordPage from "../pages/ResetPasswordPage"
import Loading from "../components/loading"

// El panel admin (y su dependencia pesada exceljs) se carga bajo demanda,
// fuera del bundle inicial que descargan los visitantes del catálogo.
const CPanel = lazy(() => import("../cpanel/cpanel"))

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<QuienesSomos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/catalogo" element={<ProductPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
                path="/catalogo/cpanel"
                element={
                    <SimpleProtectedRoute requireAdmin={true}>
                        <Suspense fallback={<Loading />}>
                            <CPanel />
                        </Suspense>
                    </SimpleProtectedRoute>
                }
            />
            <Route path="/*" element={<Home />} />
        </Routes>
    )
}
