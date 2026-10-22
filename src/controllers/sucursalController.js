const sucursalService = requiere('..services/sucursalService');


/**
 * Aca se obtienen los listado de todas las sucursale activas  
 */

async function getSucursales(req, res) {
    try {
        const sucursales = await sucursalService.obtenerSucursales();
        return res.status(200).json({
            success: true,
            data: sucursales
        });
    } catch (error) {
        console.error('Error en sucursalController.getSucursales: ', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de sucursales',
            error: error.message
        });
    }
}

/**
 * Obtiene una sucursal específica por su ID.
 */
async function getSucursalById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la sucursal debe ser un número válido'
      });
    }

    const sucursal = await sucursalService.obtenerSucursalPorId(id);

    if (!sucursal) {
      return res.status(404).json({
        success: false,
        message: `Sucursal con ID ${id} no encontrada`
      });
    }

    return res.status(200).json({
      success: true,
      data: sucursal
    });
  } catch (error) {
    console.error('Error en sucursalController.getSucursalById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar la sucursal',
      error: error.message
    });
  }
}

module.exports = {
  getSucursales,
  getSucursalById
};
