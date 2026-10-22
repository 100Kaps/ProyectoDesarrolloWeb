const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

// Verificación preventiva antes de registrar
if (typeof sucursalController.getSucursales !== 'function') {
  console.error('ERROR: sucursalController.getSucursales no es una función.');
}

if (typeof sucursalController.getSucursalById !== 'function') {
  console.error('ERROR: sucursalController.getSucursalById no es una función.');
}

router.get('/', sucursalController.getSucursales);
router.get('/:id', sucursalController.getSucursalById);

module.exports = router;