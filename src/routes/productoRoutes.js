const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.getProductos);
router.post('/', productoController.createProducto);
router.get('/:idProducto/receta', productoController.getRecetaByProducto);

module.exports = router;