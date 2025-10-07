import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { addProduct, uploadProductImages } from './firebaseUtils';

const categories = [
  'Electrónicos',
  'Hogar',
  'Informática',
  'Ropa',
  'Otros'
];

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export default function PublishProduct({ onBack }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);

  const handleImageUrlChange = (index, value) => {
    const copy = [...imageUrls];
    copy[index] = value;
    setImageUrls(copy);
  };

  const addImageField = () => setImageUrls(prev => [...prev, '']);
  const removeImageField = (index) => setImageUrls(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (!title || title.trim() === '') throw new Error('El título es obligatorio');
      const parsedPrice = parseFloat(price);
      if (Number.isNaN(parsedPrice)) throw new Error('Precio inválido');
      const validImages = imageUrls.filter(u => u && u.trim() !== '');
      await addProduct({
        title,
        description,
        price: parsedPrice,
        category,
        images: validImages,
        userId: user.uid
      });
      alert('¡Producto publicado con éxito!');
      onBack();
    } catch (error) {
      console.error('Error al publicar el producto:', error);
      alert('Hubo un error al publicar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-8">
        <img src="/logo-nande-commerce.png" alt="Ñande Commerce Logo" className="h-8 w-auto mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Publicar producto
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Imágenes (URLs)</label>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button type="button" onClick={() => removeImageField(idx)} className="px-3 py-2 bg-red-100 rounded">X</button>
              </div>
            ))}
            <button type="button" onClick={addImageField} className="mt-2 px-3 py-2 bg-teal-100 rounded">Agregar URL</button>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
              Título del producto
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
              Descripción
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">
              Precio
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 disabled:bg-teal-300"
          >
            {loading ? 'Publicando...' : 'Publicar'}
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
}
