const express = require('express');
const path = require('path');
const cors = require('cors');

// Importacion de los enrutadores o route
const sucursalRoutes = require('./routes/sucursalRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES DE CONFIGURACIÓN

// Permitir peticiones de otros orígenes (CORS)
app.use(cors());

// Parseo de cuerpos de peticiones en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos de la interfaz Frontend (public/)
app.use(express.static(path.join(__dirname, '../public')));

// RUTAS DE LA API REST (Rutas Neumónicas)

app.use('/api/sucursales', sucursalRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// RUTAS DE VISTAS (HTML)

// Servir la página principal (Dashboard / Inicio)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Servir la vista de capturas de pedidos por sucursal
app.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/pedidos.html'));
});

// Servir la vista de gestión de recetas e insumos
app.get('/recetas', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/recetas.html'));
});


// Servir el detalle del pedido desde la carpeta public/
app.get('/detalle-pedido.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/detalle-pedido.html'));
});

// MANEJO DE ERRORES Y RUTAS NO ENCONTRADAS (404)

// Captura de rutas no definidas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'La ruta solicitada no existe en el servidor'
  });
});

// Manejador global de errores del servidor (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado en el servidor:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// INICIALIZACIÓN DEL SERVIDOR

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Servidor de Panadería San Carlos corriendo en:`);
  console.log(` http://localhost:${PORT}`);
  console.log(`====================================================`);
});

module.exports = app;