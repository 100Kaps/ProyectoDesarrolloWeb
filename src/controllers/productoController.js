const productoService = require('../services/productoService');

/**
 * Obtiene todos los productos registrados o filtrados por tipo (Final o Insumo).
 */
async function getProductos(req, res) {
  try {
    const { id_tipo } = req.query; // Permite filtrar por tipo vía query: /api/productos?id_tipo=1
    const productos = await productoService.obtenerProductos(id_tipo);

    return res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('Error en productoController.getProductos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el listado de productos',
      error: error.message
    });
  }
}

/**
 * Registra un nuevo producto (Pan o Insumo).
 */
async function createProducto(req, res) {
  try {
    const { id_tipo, nombre, unidad_medida } = req.body;

    if (!id_tipo || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de producto y el nombre son campos obligatorios'
      });
    }

    const nuevoProducto = await productoService.crearProducto({ id_tipo, nombre, unidad_medida });

    return res.status(201).json({
      success: true,
      message: 'Producto registrado exitosamente',
      data: nuevoProducto
    });
  } catch (error) {
    console.error('Error en productoController.createProducto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
}

/**
 * Obtiene la receta (lista de insumos necesarios) para un pan específico.
 */
async function getRecetaByProducto(req, res) {
  try {
    const { idProducto } = req.params;

    if (!idProducto || isNaN(idProducto)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto no válido'
      });
    }

    const receta = await productoService.obtenerRecetaPorProducto(idProducto);

    return res.status(200).json({
      success: true,
      data: receta
    });
  } catch (error) {
    console.error('Error en productoController.getRecetaByProducto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar la receta del producto',
      error: error.message
    });
  }
}

module.exports = {
  getProductos,
  createProducto,
  getRecetaByProducto
};