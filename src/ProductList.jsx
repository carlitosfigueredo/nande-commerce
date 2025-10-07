import React, { useEffect, useState } from 'react';
import { getProducts } from './firebaseUtils';

const PAGE_SIZE = 10;
const categories = [
  'Todos',
  'Electrónicos',
  'Hogar',
  'Informática',
  'Ropa',
  'Otros'
];

export default function ProductList({ onBack }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Todos');
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageStack, setPageStack] = useState([]);

  const fetchProducts = async (direction = 'next') => {
    setLoading(true);
    const { items, lastVisible, firstVisible } = await getProducts({
      category: category === 'Todos' ? null : category,
      pageSize: PAGE_SIZE,
      startAfter: direction === 'next' ? lastDoc : null,
      endBefore: direction === 'prev' ? firstDoc : null
    });
    setProducts(items);
    setLastDoc(lastVisible);
    setFirstDoc(firstVisible);
    if (direction === 'next') {
      setPageStack((stack) => [...stack, firstVisible]);
    } else if (direction === 'prev') {
      setPageStack((stack) => stack.slice(0, -1));
    }
    setLoading(false);
  };

  useEffect(() => {
    setLastDoc(null);
    setFirstDoc(null);
    setPageStack([]);
    fetchProducts();
    // eslint-disable-next-line
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Productos publicados</h2>
        <div className="mb-4 flex justify-between items-center">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button onClick={onBack} className="bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition">Volver</button>
        </div>
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">No hay productos publicados.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col">
                <div className="flex justify-center mb-2">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.title} className="h-32 w-32 object-cover rounded-lg border" />
                  ) : (
                    <img src="https://via.placeholder.com/150" alt="Sin imagen" className="h-32 w-32 object-cover rounded-lg border" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                <div className="text-gray-600 mb-1">{product.category}</div>
                <div className="text-gray-800 mb-2">{product.description}</div>
                <div className="font-bold text-teal-700 mb-2">${product.price}</div>
                <div className="text-xs text-gray-400">Publicado: {product.createdAt?.toDate?.().toLocaleString?.() || ''}</div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => fetchProducts('prev')}
            disabled={pageStack.length <= 1}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg mr-2 disabled:opacity-50"
          >Anterior</button>
          <button
            onClick={() => fetchProducts('next')}
            disabled={products.length < PAGE_SIZE}
            className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-teal-300"
          >Siguiente</button>
        </div>
      </div>
    </div>
  );
}
