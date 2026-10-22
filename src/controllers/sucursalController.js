const sucursalService = require('../services/sucursalService');

async function getSucursales(req, res) {
  try {
    const sucursales = await sucursalService.obtenerSucursales();
    return res.status(200).json({ success: true, data: sucursales });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getSucursalById(req, res) {
  try {
    const { id } = req.params;
    const sucursal = await sucursalService.obtenerSucursalPorId(id);
    if (!sucursal) {
      return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
    }
    return res.status(200).json({ success: true, data: sucursal });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ASEGÚRATE DE EXPORTAR AMBAS FUNCIONES DE ESTA MANERA
module.exports = {
  getSucursales,
  getSucursalById
};