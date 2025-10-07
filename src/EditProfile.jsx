import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { updateUserProfile } from './firebaseUtils';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export default function EditProfile({ onBack }) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);

  // Now we accept a photo URL as text instead of file upload
  const handleImageUrlChange = (e) => {
    setPhotoURL(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const newPhotoURL = photoURL || user.photoURL || '';
      await updateUserProfile(user, {
        displayName,
        description,
        photoURL: newPhotoURL
      });
      // Forzar actualización del usuario en AuthContext
      if (user.reload) await user.reload();
      alert('¡Perfil actualizado con éxito!');
      onBack();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert('Hubo un error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-8">
        <img src="/logo-nande-commerce.png" alt="Ñande Commerce Logo" className="h-8 w-auto mx-auto mb-4"/>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Editar perfil
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="relative w-28 h-28 mx-auto mb-4">
            <img 
              src={photoURL || '/logo-nande-commerce.png'} 
              alt="Perfil" 
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-600 mb-1">
              URL de la foto de perfil
            </label>
            <input
              id="photoUrl"
              type="text"
              placeholder="https://..."
              value={photoURL}
              onChange={handleImageUrlChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
              Descripción
            </label>
            <input
              id="description"
              type="text"
              placeholder="Acerca de mí"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 disabled:bg-teal-300"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full mt-2 bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
// ...existing code...
}
