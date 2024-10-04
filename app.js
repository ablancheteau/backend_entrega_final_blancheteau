require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars'); 
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); 
const cartRoutes = require('./routes/cartRoutes');

const app = express();


app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        multiply: (price, quantity) => price * quantity  // Helper para multiplicar precio por cantidad
    }
}));
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Usar las rutas de productos
app.use('/api/products', productRoutes);

// Usar las rutas del carrito y proceso de compra
app.use('/cart', cartRoutes);

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000, 
    connectTimeoutMS: 30000 
})
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos', err));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});