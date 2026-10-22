const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.getPedidos);
router.post('/', pedidoController.createPedido);
router.get('/:id', pedidoController.getPedidoById);

module.exports = router;