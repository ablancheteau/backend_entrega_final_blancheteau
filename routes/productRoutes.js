const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// Crear producto
router.post('/', createProduct);

// Obtener todos los productos y renderizar la vista
router.get('/', getProducts);

// Obtener un producto por ID y renderizar la vista
router.get('/:productId', getProductById);

// Actualizar producto
router.post('/update/:productId', updateProduct);

// Eliminar producto
router.post('/delete/:productId', deleteProduct);

module.exports = router;
