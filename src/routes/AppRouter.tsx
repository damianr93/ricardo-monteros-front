import { Route, Routes } from "react-router"
import { Home } from "../home/home"
import QuienesSomos from "../aboutUs/AboutUs"
import ProductPage from "../product/ProductPage"
import Contacto from "../contact/Contact"
import CPanel from "../cpanel/cpanel"
import SimpleProtectedRoute from "../components/SimpleProtectedRoute"
import ResetPasswordPage from "../pages/ResetPasswordPage"

export const AppRouter = () => {
    return (
        <>
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
                            <CPanel />
                        </SimpleProtectedRoute>
                    } 
                />
                <Route path="/*" element={<Home />} />
            </Routes>
        </>
    )
}
