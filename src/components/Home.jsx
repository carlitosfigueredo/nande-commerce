import { useAuth } from "../AuthContext";
import { logout } from "../auth";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo-nande-commerce.png" alt="ÑandeCommerce" className="h-10 w-auto" />
              <span className="ml-3 text-xl font-bold text-teal-900">ÑandeCommerce</span>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 hidden sm:inline">Hola, {user.displayName}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Bienvenido a ÑandeCommerce
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-teal-100">
            E-commerce con identidad paraguaya 🇵🇾
          </p>
          <p className="text-lg max-w-2xl mx-auto text-teal-50">
            Descubre productos únicos y auténticos que celebran nuestra cultura y tradiciones
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Categorías Destacadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Artesanías", icon: "🎨", color: "from-amber-400 to-orange-500" },
            { name: "Textiles", icon: "🧶", color: "from-pink-400 to-rose-500" },
            { name: "Alimentos", icon: "🍽️", color: "from-green-400 to-emerald-500" },
            { name: "Música", icon: "🎵", color: "from-purple-400 to-indigo-500" },
          ].map((category) => (
            <div
              key={category.name}
              className={`bg-gradient-to-br ${category.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Producto {item}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Producto auténtico de Paraguay con calidad garantizada
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-teal-700">₲ 150.000</span>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-br from-teal-50 to-teal-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sobre ÑandeCommerce
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Somos una plataforma de comercio electrónico dedicada a promover y comercializar 
              productos paraguayos auténticos, apoyando a artesanos y productores locales.
            </p>
            <p className="text-lg text-gray-700">
              Nuestra misión es conectar la riqueza cultural de Paraguay con el mundo, 
              manteniendo vivas nuestras tradiciones y apoyando la economía local.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ÑandeCommerce</h3>
              <p className="text-gray-400">
                E-commerce con identidad paraguaya
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Inicio</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Productos</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Categorías</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@nandecommerce.com</li>
                <li>📱 +595 XXX XXX XXX</li>
                <li>📍 Asunción, Paraguay</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 ÑandeCommerce. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
