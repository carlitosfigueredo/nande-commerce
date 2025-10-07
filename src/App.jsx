import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { loginWithGoogle, logout } from "./auth";
import './index.css'


function AppContent() {
  const { user, loading } = useAuth();
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [viewingProducts, setViewingProducts] = React.useState(false);
  const [publishingProduct, setPublishingProduct] = React.useState(false);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error en logout:", error);
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
    if (editingProfile) {
      const EditProfile = React.lazy(() => import("./EditProfile"));
      return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
          <EditProfile onBack={() => setEditingProfile(false)} />
        </React.Suspense>
      );
    }
    if (publishingProduct) {
      const PublishProduct = React.lazy(() => import("./PublishProduct"));
      return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
          <PublishProduct onBack={() => setPublishingProduct(false)} />
        </React.Suspense>
      );
    }
    if (viewingProducts) {
      const ProductList = React.lazy(() => import("./ProductList"));
      return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
          <ProductList onBack={() => setViewingProducts(false)} />
        </React.Suspense>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <img src="/logo-nande-commerce.png" alt="Ñande Commerce Logo" className="h-8 w-auto mx-auto mb-4"/>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Bienvenido a <span className="text-teal-600">Ñande Commerce</span>
          </h2>
          <div className="flex flex-col items-center mb-4">
            <img
              src={user.photoURL || 'https://via.placeholder.com/150'}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mb-2"
            />
            <p className="text-base text-gray-600"><span className="font-semibold">{user.displayName}</span> 👋</p>
          </div>
          <button
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 mb-2"
            onClick={() => setEditingProfile(true)}
          >
            Editar perfil
          </button>
          <button
            className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition duration-300 mb-2"
            onClick={() => setPublishingProduct(true)}
          >
            Publicar producto
          </button>
          <button
            className="w-full bg-teal-100 text-teal-900 font-bold py-3 px-4 rounded-lg hover:bg-teal-200 transition duration-300 mb-2"
            onClick={() => setViewingProducts(true)}
          >
            Ver productos
          </button>
          <button
            className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
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
