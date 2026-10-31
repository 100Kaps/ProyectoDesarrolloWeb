import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Reemplaza con tus claves reales de la Consola de Firebase
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

// Exportar funciones individuales
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

// Mantenemos asignación global como respaldo
window.API = { getPedidos, actualizarEstado };