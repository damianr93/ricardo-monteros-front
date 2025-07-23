import React, { useState } from "react";
import { toast } from "react-toastify";

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  // Campos obligatorios
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Campos opcionales
  const [razonSocial, setRazonSocial] = useState("");
  const [CUIT, setCUIT] = useState("");
  const [caracteristica, setCaracteristica] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingrese un email válido", {
        position: "top-left",
      });
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres", {
        position: "top-left",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden", { position: "top-left" });
      return;
    }

    // Validaciones opcionales
    if (CUIT && !/^\d{11}$/.test(CUIT)) {
      toast.error("El CUIT debe tener 11 dígitos", {
        position: "top-left",
      });
      return;
    }

    if (
      codigoPostal &&
      (isNaN(Number(codigoPostal)) || Number(codigoPostal) <= 0)
    ) {
      toast.error("El código postal debe ser un número válido", {
        position: "top-left",
      });
      return;
    }

    // Construir objeto de datos
    const userData: any = { name, email, password };

    // Agregar campos opcionales si tienen valor
    if (razonSocial.trim()) userData.razonSocial = razonSocial.trim();
    if (CUIT.trim()) userData.CUIT = CUIT.trim();
    if (caracteristica.trim() && telefono.trim()) {
      userData.phone = `${caracteristica.trim()}-${telefono.trim()}`;
    }
    if (direccion.trim()) userData.direccion = direccion.trim();
    if (localidad.trim()) userData.localidad = localidad.trim();
    if (provincia.trim()) userData.provincia = provincia.trim();
    if (codigoPostal.trim())
      userData.codigoPostal = Number(codigoPostal.trim());

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrarse");
      }
      toast.info(
        "Registro exitoso, espere un correo electronico con la aprobación para poder logearse",
        { position: "top-left" }
      );
      onSuccess();
    } catch (err: any) {
      toast.error("Algo salió mal, intente nuevamente", {
        position: "top-left",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-secondary-lightest p-8 rounded-lg shadow-lg space-y-6 border border-secondary-dark"
    >
      <h2 className="font-heading text-2xl text-primary text-center mb-6">
        Registrarse
      </h2>

      <div className="space-y-4">
        {/* Campos obligatorios */}
        <div>
          <label className="block text-secondary-darkest mb-2">Nombre *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-secondary-darkest mb-2">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-secondary-darkest mb-2">
            Contraseña *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-secondary-darkest mb-2">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors ${
              confirmPassword === ""
                ? "border-secondary-darkest focus:ring-primary"
                : password === confirmPassword
                ? "border-green-500 bg-green-50 focus:ring-green-500"
                : "border-red-500 bg-red-50 focus:ring-red-500"
            }`}
          />
        </div>

        {/* Separador */}
        <div className="border-t border-secondary-dark pt-4">
          <p className="text-secondary-darkest text-sm mb-4">
            Información adicional (opcional)
          </p>
        </div>

        {/* Campos opcionales */}
        <div>
          <label className="block text-secondary-darkest mb-2">
            Razón Social
          </label>
          <input
            type="text"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-secondary-darkest mb-2">CUIT</label>
          <input
            type="text"
            value={CUIT}
            onChange={(e) => setCUIT(e.target.value.replace(/\D/g, ""))}
            maxLength={11}
            placeholder="11 dígitos"
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-secondary-darkest mb-2">Teléfono</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={caracteristica}
              onChange={(e) =>
                setCaracteristica(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Característ."
              maxLength={4}
              className="w-1/3 border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              placeholder="Número"
              maxLength={8}
              className="w-2/3 border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-secondary-darkest mb-2">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-secondary-darkest mb-2">Localidad</label>
          <input
            type="text"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-secondary-darkest mb-2">Provincia</label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-secondary-darkest mb-2">
            Código Postal
          </label>
          <input
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-secondary-lightest py-2 rounded-md hover:bg-primary-dark transition"
      >
        Crear Cuenta
      </button>
    </form>
  );
};

export default RegisterForm;
