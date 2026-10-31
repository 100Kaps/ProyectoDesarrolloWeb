// Importar Firebase SDKs directamente desde CDN en formato ESM / Módulos Web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Coloca aquí la configuración obtenida en el Paso 1
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "proyectodesarrolloweb-a1a36.firebaseapp.com",
  projectId: "proyectodesarrolloweb-a1a36",
  storageBucket: "proyectodesarrolloweb-a1a36.appspot.com",
  messagingSenderId: "10355840983556789386",
  appId: "TU_APP_ID_AQUI"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Objeto global de API expuesto al navegador
window.API = {
  // 1. Obtener todos los pedidos
  async getPedidos() {
    try {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      return { success: true, data };
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      return { success: false, message: error.message };
    }
  },

  // 2. Obtener lista de sucursales
  async getSucursales() {
    try {
      const querySnapshot = await getDocs(collection(db, "sucursales"));
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      return { success: true, data };
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
      return { success: false, message: error.message };
    }
  },

  // 3. Obtener lista de productos
  async getProductos() {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      return { success: true, data };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return { success: false, message: error.message };
    }
  },

  // 4. Guardar / Crear un nuevo pedido en Firestore
  async crearPedido(datosPedido) {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        ...datosPedido,
        estado: 'PENDIENTE',
        fecha: new Date().toISOString().split('T')[0],
        creadoEn: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al guardar pedido en Firebase:", error);
      return { success: false, message: error.message };
    }
  },

  // 5. Actualizar el estado de un pedido (por ejemplo, a ENTREGADO)
  async actualizarEstado(idPedido, nuevoEstado) {
    try {
      const pedidoRef = doc(db, "pedidos", idPedido);
      await updateDoc(pedidoRef, { estado: nuevoEstado });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      return { success: false, message: error.message };
    }
  }
};