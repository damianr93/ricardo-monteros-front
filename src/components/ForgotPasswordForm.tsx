import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { forgotPassword } from "../store/logged/thunks";
import Loading from "./loading";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await dispatch(forgotPassword(email));
      setMessage("Si el email existe, se enviará un enlace de recuperación");
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      setMessage("Error al enviar la solicitud. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-secondary-lightest p-8 rounded-lg shadow-lg space-y-6">
      <h2 className="font-heading text-2xl mb-6 text-primary text-center">
        Recuperar Contraseña
      </h2>
      
      {message && (
        <div className={`p-4 rounded-lg text-center ${
          message.includes("Error") 
            ? "bg-red-100 text-red-700" 
            : "bg-green-100 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-secondary-darkest">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-secondary-darkest rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ingresa tu email"
          />
        </div>
        
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-secondary-lightest py-3 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            Enviar Enlace de Recuperación
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 transition"
          >
            Volver al Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

