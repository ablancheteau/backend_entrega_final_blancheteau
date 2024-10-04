const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Agregar producto al carrito
router.post('/', cartController.addToCart);

// Eliminar producto del carrito
router.post('/remove', cartController.removeFromCart);

// Vaciar el carrito
router.post('/clear', cartController.clearCart);

// Ver el carrito
router.get('/', cartController.getCart);

// Procesar el checkout
router.post('/checkout', cartController.checkout);

module.exports = router;
