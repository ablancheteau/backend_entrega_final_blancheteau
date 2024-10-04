const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        // Buscar o crear el carrito asociado al usuario
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({ userId: req.userId, items: [] });
        }

        // Verificar si el producto ya está en el carrito
        const productInCart = cart.items.find(item => item.product.toString() === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.redirect('/cart');  // Redirigir al carrito después de agregar un producto
    } catch (error) {
        res.status(500).render('error', { message: 'Error al agregar el producto al carrito', error });
    }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        // Buscar el producto en el carrito y eliminarlo
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.items.splice(productIndex, 1);  // Eliminar el producto
            await cart.save();
            res.redirect('/cart');  // Redirigir al carrito después de eliminar un producto
        } else {
            res.status(404).render('error', { message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).render('error', { message: 'Error al eliminar el producto del carrito', error });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        cart.items = [];  // Vaciar el carrito
        await cart.save();
        res.redirect('/cart');  // Redirigir al carrito vacío después de limpiar
    } catch (error) {
        res.status(500).render('error', { message: 'Error al vaciar el carrito', error });
    }
};

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.render('cart', { carrito: [], total: 0, message: 'Tu carrito está vacío.' });
        }

        // Calcular el total del carrito
        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        res.render('cart', { carrito: cart.items, total });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al obtener el carrito', error });
    }
};

// Procesar el checkout
exports.checkout = async (req, res) => {
    const { direccion, tarjeta } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).render('error', { message: 'Tu carrito está vacío' });
        }

        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const newOrder = new Order({
            userId: req.userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            total,
            shippingAddress: direccion,
            paymentMethod: 'Tarjeta de crédito'
        });

        await newOrder.save();

        // Limpiar el carrito después de la compra
        await Cart.findByIdAndDelete(cart._id);

        res.redirect('/confirmacion');  // Redirigir a la confirmación de la compra
    } catch (error) {
        res.status(500).render('error', { message: 'Error al procesar el checkout', error });
    }
};