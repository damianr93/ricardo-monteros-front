import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      navigate("/");
      return;
    }
    setToken(tokenParam);
  }, [searchParams, navigate]);

  const handleSuccess = () => {
    navigate("/");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-secondary-lightest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-primary mb-4">Token Inválido</h2>
          <p className="text-secondary-darkest mb-4">El enlace de recuperación no es válido.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-secondary-lightest px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-lightest flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
