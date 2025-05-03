import { Route, Routes } from "react-router"
import { Home } from "../home/home"
import QuienesSomos from "../aboutUs/AboutUs"
import ProductPage from "../product/ProductPage"
import Contacto from "../contact/Contact"
import CPanel from "../cpanel/cpanel"

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/nosotros" element={<QuienesSomos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/catalogo" element={<ProductPage />} />
                <Route path="/catalogo/cpanel" element={<CPanel />} />
            </Routes>
        </>
    )
}
