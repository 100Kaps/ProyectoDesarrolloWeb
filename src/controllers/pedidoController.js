const pedidoService = require('../services/pedidoService');

/**
 * Registra un nuevo pedido completo (Cabecera y Detalle de Panes).
 */
async function createPedido(req, res) {
  try {
    const { idSucursal, ruta, detalles } = req.body;

    // Validaciones de negocio en el Backend
    if (!idSucursal || isNaN(idSucursal)) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar una sucursal válida'
      });
    }

    if (!ruta || typeof ruta !== 'string' || ruta.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar el número o nombre de la ruta (Ej: Ruta 3)'
      });
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe incluir al menos un producto en el detalle'
      });
    }

    // Llamada al servicio que invoca el Stored Procedure / Paquete PL/SQL en Oracle
    const resultado = await pedidoService.crearPedidoCompleto(idSucursal, ruta, detalles);

    return res.status(201).json({
      success: true,
      message: 'Pedido registrado con éxito en la base de datos',
      idPedido: resultado.idPedido
    });
  } catch (error) {
    console.error('Error en pedidoController.createPedido:', error);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error al procesar la transacción del pedido',
      error: error.message
    });
  }
}

/**
 * Obtiene el listado de pedidos registrados.
 */
async function getPedidos(req, res) {
  try {
    const { fecha, idSucursal } = req.query;
    const pedidos = await pedidoService.obtenerPedidos({ fecha, idSucursal });

    return res.status(200).json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    console.error('Error en pedidoController.getPedidos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar la lista de pedidos',
      error: error.message
    });
  }
}

/**
 * Consulta un pedido específico con todo su detalle de cantidades (Mañana, Resto, Tarde).
 */
async function getPedidoById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'El ID del pedido debe ser un número válido'
      });
    }

    const pedido = await pedidoService.obtenerPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: `El pedido número ${id} no existe`
      });
    }

    return res.status(200).json({
      success: true,
      data: pedido
    });
  } catch (error) {
    console.error('Error en pedidoController.getPedidoById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar el detalle del pedido',
      error: error.message
    });
  }
}

async function cambiarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nuevo estado es requerido' 
      });
    }

    // Convertimos id a entero para asegurar compatibilidad con Oracle
    const idPedidoNum = parseInt(id, 10);
    const actualizado = await pedidoService.cambiarEstadoPedido(idPedidoNum, estado);

    if (actualizado) {
      return res.status(200).json({ 
        success: true, 
        message: `Pedido #${idPedidoNum} actualizado a ${estado}` 
      });
    } else {
      return res.status(404).json({ 
        success: false, 
        message: 'Pedido no encontrado' 
      });
    }
  } catch (error) {
    console.error('Error en cambiarEstado:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar estado del pedido', 
      error: error.message 
    });
  }
}

module.exports = {
  createPedido,
  getPedidos,
  getPedidoById,
  cambiarEstado
};