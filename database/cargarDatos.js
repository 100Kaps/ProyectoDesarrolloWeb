const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

// Inicializar la app con las credenciales
initializeApp({
  credential: cert(serviceAccount)
});

// Obtener la instancia de Firestore
const db = getFirestore();

// Datos de prueba para insertar
const productos = [
  { nombre: 'Cubos', tipo: 'PRODUCTO_FINAL', unidad: 'UNIDAD' },
  { nombre: 'Especial', tipo: 'PRODUCTO_FINAL', unidad: 'UNIDAD' },
  { nombre: 'Francés', tipo: 'PRODUCTO_FINAL', unidad: 'UNIDAD' }
];

async function subirDatos() {
  const coleccionRef = db.collection('productos');

  for (const prod of productos) {
    await coleccionRef.add(prod);
    console.log(`Producto guardado: ${prod.nombre}`);
  }
  console.log('¡Carga masiva completada exitosamente!');
}

subirDatos().catch(console.error);