const nodemailer = require('nodemailer');
const Product = require('../models/product');
const User = require('../models/user');  // Para obtener los detalles del usuario

// Configurar Nodemailer para enviar correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Controlador para crear productos
const createProduct = async (req, res) => {
    const { name, price, description } = req.body;
    const userId = req.userId;

    try {
        const newProduct = new Product({
            name,
            price,
            description,
            userId
        });

        await newProduct.save();
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};

// Controlador para obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

// Controlador para obtener un producto por su ID
const getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.render('product', { product });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

// Controlador para actualizar un producto
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, description } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            price,
            description,
            updatedAt: Date.now()
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.redirect(`/products/${productId}`);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};

// Controlador para eliminar productos y enviar correo si es premium
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const user = await User.findById(product.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await Product.findByIdAndDelete(productId);

        if (user.role === 'premium') {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Producto eliminado',
                text: `Hola ${user.name}, tu producto "${product.name}" ha sido eliminado de nuestra plataforma.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo: ', error);
                }
            });
        }

        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};