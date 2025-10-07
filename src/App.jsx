import { AuthProvider, useAuth } from "./AuthContext";
import { loginWithGoogle } from "./auth";
import Home from "./components/Home";
import './index.css'


function AppContent() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300">
        <span className="text-teal-900 text-lg font-semibold animate-pulse">Cargando...</span>
      </div>
    );
  }

  if (user) {
    return <Home />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center w-full max-w-sm">
        <img src="/logo-nande-commerce.png" alt="Logo" className="mb-4 drop-shadow object-center" />
        <p className="text-base text-gray-600 mb-6">con identidad paraguaya</p>
        <button className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer font-medium hover:shadow-lg hover:bg-teal-50 transition-all duration-200 text-teal-900" onClick={handleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
