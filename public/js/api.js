import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Reemplaza con tus claves reales de la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "proyectodesarrolloweb-a1a36.firebaseapp.com",
  projectId: "proyectodesarrolloweb-a1a36",
  storageBucket: "proyectodesarrolloweb-a1a36.appspot.com",
  messagingSenderId: "10355840983556789386",
  appId: "1:10355840983556789386:web:..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Obtener todos los pedidos (EXPORTACIÓN AGREGADA)
export async function getPedidos() {
  try {
    const querySnapshot = await getDocs(collection(db, "pedidos"));
    const data = [];
    querySnapshot.forEach((docSnap) => data.push({ id: docSnap.id, ...docSnap.data() }));
    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return { success: false, message: error.message };
  }
}

// 2. Obtener lista de sucursales
export async function getSucursales() {
  try {
    const querySnapshot = await getDocs(collection(db, "sucursales"));
    const data = [];
    querySnapshot.forEach((docSnap) => data.push({ id: docSnap.id, ...docSnap.data() }));
    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    return { success: false, message: error.message };
  }
}

// 3. Obtener lista de productos
export async function getProductos() {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const data = [];
    querySnapshot.forEach((docSnap) => data.push({ id: docSnap.id, ...docSnap.data() }));
    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return { success: false, message: error.message };
  }
}

// 4. Crear nuevo pedido
export async function crearPedido(datosPedido) {
  try {
    const docRef = await addDoc(collection(db, "pedidos"), {
      ...datosPedido,
      estado: 'PENDIENTE',
      fecha: new Date().toISOString().split('T')[0],
      creadoEn: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return { success: false, message: error.message };
  }
}

// 5. Actualizar estado del pedido
export async function actualizarEstado(idPedido, nuevoEstado) {
  try {
    const pedidoRef = doc(db, "pedidos", idPedido);
    await updateDoc(pedidoRef, { estado: nuevoEstado });
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return { success: false, message: error.message };
  }
}