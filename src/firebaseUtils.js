import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, collection, addDoc, query, orderBy, limit, where, getDocs, startAfter, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { app } from './firebaseConfig'; // Asegúrate de que tu configuración de Firebase se exporte desde aquí

const storage = getStorage(app);
const db = getFirestore(app);

/**
 * Sube la imagen de perfil de un usuario a Firebase Storage.
 * @param {string} uid - El ID del usuario.
 * @param {File} file - El archivo de imagen a subir.
 * @returns {Promise<string>} - La URL de descarga de la imagen subida.
 */
export const uploadProfileImage = async (uid, file) => {
  try {
    // Diagnóstico: mostrar bucket configurado y ruta destino
    console.debug('uploadProfileImage: app.storageBucket=', app?.options?.storageBucket);
    const storageRef = ref(storage, `profile_pictures/${uid}/${file.name}`);
    console.debug('uploadProfileImage: storageRef.fullPath=', storageRef.fullPath);
    const snap = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.debug('uploadProfileImage: upload success, url=', downloadURL);
    return downloadURL;
  } catch (err) {
    console.error('uploadProfileImage error:', err);
    // Añadir sugerencia útil para CORS / bucket mismatch
    if (err && err.message && err.message.toLowerCase().includes('network')) {
      console.error('uploadProfileImage: parece un error de red/CORS. Verifica Storage rules y que storageBucket en firebaseConfig.js coincida con tu proyecto.');
    }
    throw err;
  }
};

/**
 * Actualiza los datos del perfil de usuario en Firebase Auth y Firestore.
 * @param {object} user - El objeto de usuario de Firebase Auth.
 * @param {object} data - Los datos a actualizar (displayName, description, photoURL).
 */
export const updateUserProfile = async (user, data) => {
  const { displayName, description, photoURL } = data;

  // 1. Actualiza el perfil en Firebase Authentication (solo soporta displayName y photoURL)
  await updateProfile(user, {
    displayName: displayName,
    photoURL: photoURL,
  });

  // 2. Guarda/actualiza los datos en una colección de Firestore 'users'
  //    Esto es útil para guardar datos adicionales como la descripción.
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, {
    uid: user.uid,
    displayName: displayName,
    email: user.email,
    photoURL: photoURL,
    description: description, // Aquí guardamos la descripción
  }, { merge: true }); // 'merge: true' evita sobrescribir otros campos si existen
};

/**
 * Sube varias imágenes de productos a Firebase Storage y retorna sus URLs.
 * @param {string} uid - El ID del usuario.
 * @param {File[]} files - Array de archivos de imagen.
 * @returns {Promise<string[]>} - Array de URLs de descarga.
 */
export const uploadProductImages = async (uid, files) => {
  const urls = [];
  try {
    for (const file of files) {
      // Diagnóstico: mostrar bucket configurado y ruta destino
      console.debug('uploadProductImages: app.storageBucket=', app?.options?.storageBucket);
      const storageRef = ref(storage, `product_images/${uid}/${Date.now()}_${file.name}`);
      console.debug('uploadProductImages: storageRef.fullPath=', storageRef.fullPath, ' file.size=', file.size, ' file.type=', file.type);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.debug('uploadProductImages: uploaded url=', downloadURL);
      urls.push(downloadURL);
    }
    return urls;
  } catch (err) {
    console.error('uploadProductImages error:', err);
    if (err && err.message && err.message.toLowerCase().includes('network')) {
      console.error('uploadProductImages: posible CORS/Network error. Revisa Network tab -> OPTIONS a firebasestorage.googleapis.com y confirma status y headers.');
    }
    throw err;
  }
};

/**
 * Guarda un producto en la colección 'products' de Firestore.
 * @param {object} productData - Datos del producto (title, description, price, category, images, userId, createdAt).
 * @returns {Promise<void>}
 */
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products');
    // Use serverTimestamp to avoid client Date serialization problems
    const dataToSave = {
      ...productData,
      createdAt: serverTimestamp()
    };
    // Diagnostic: print payload and field types to help debug bad-request errors
    try {
      const types = Object.keys(dataToSave).reduce((acc, k) => {
        const v = dataToSave[k];
        acc[k] = Array.isArray(v) ? `array(${v.length})` : (v === null ? 'null' : typeof v);
        return acc;
      }, {});
      console.debug('addProduct: dataToSave types=', types);
      console.debug('addProduct: dataToSave sample=', Object.fromEntries(Object.keys(dataToSave).slice(0,10).map(k=>[k, dataToSave[k]])));
    } catch (logErr) {
      console.warn('addProduct: error printing payload diagnostics', logErr);
    }
    const docRef = await addDoc(productsRef, dataToSave);
    return docRef.id;
  } catch (err) {
    console.error('addProduct error:', err);
    throw err;
  }
};
// import { query, collection, orderBy, limit, where, getDocs, startAfter } from 'firebase/firestore';

/**
 * Obtiene productos paginados y filtrados por categoría.
 * @param {object} options - { category, pageSize, startAfter }
 * @returns {Promise<{items: object[], lastVisible: any, firstVisible: any}>}
 */
export const getProducts = async ({ category = null, pageSize = 10, startAfter: start = null } = {}) => {
  let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(pageSize));
  if (category) {
    q = query(collection(db, 'products'), where('category', '==', category), orderBy('createdAt', 'desc'), limit(pageSize));
  }
  if (start) {
    q = query(q, startAfter(start));
  }
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return {
    items,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
    firstVisible: snapshot.docs[0]
  };
};