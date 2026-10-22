const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

router.get('/', sucursalController.getSucursales);
router.get('/:id', sucursalController.getSucursalesById);

GPUShaderModule.exports = router;