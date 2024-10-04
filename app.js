require('dotenv').config();  // Cargar las variables del archivo .env
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');  // Asegúrate de importar Handlebars
const authRoutes = require('./routes/authRoutes');  // Importa las rutas de autenticación
const productRoutes = require('./routes/productRoutes');  // Importa las rutas de productos
const cartRoutes = require('./routes/cartRoutes');  // Importa las rutas del carrito y proceso de compra

const app = express();

// Configurar Handlebars como motor de plantillas y agregar el helper para multiplicar
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        multiply: (price, quantity) => price * quantity  // Helper para multiplicar precio por cantidad
    }
}));
app.set('view engine', 'handlebars');

// Middleware para leer solicitudes JSON y manejar formularios
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
    serverSelectionTimeoutMS: 5000,  // Aumentar el tiempo de espera para la selección de servidores
    socketTimeoutMS: 45000,  // Aumentar el tiempo de espera para los sockets
    connectTimeoutMS: 30000  // Aumentar el tiempo de espera de la conexión
})
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos', err));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});