import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Reemplaza con tus credenciales obtenidas de la consola de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "proyectodesarrolloweb-a1a36.firebaseapp.com",
  projectId: "proyectodesarrolloweb-a1a36",
  storageBucket: "proyectodesarrolloweb-a1a36.appspot.com",
  messagingSenderId: "10355840983556789386",
  appId: "TU_APP_ID_AQUI"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.API = {
  // Obtener Sucursales
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

  // Obtener Productos
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

  // Guardar un Pedido Completo (Cabecera + Detalle)
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
      console.error("Error al crear pedido:", error);
      return { success: false, message: error.message };
    }
  },

  // Obtener Pedidos Registrados
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
  }
};