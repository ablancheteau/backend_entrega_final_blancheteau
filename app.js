require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars'); 
const path = require('path');  // Importar path para configurar la ruta de las vistas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); 
const cartRoutes = require('./routes/cartRoutes');
const homeController = require('./controllers/homeController'); // Importa el controlador de la página de inicio

const app = express();

// Configurar Handlebars con layout y helper personalizado
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        multiply: (price, quantity) => price * quantity  // Helper para multiplicar precio por cantidad
    }
}));
app.set('view engine', 'handlebars');

// Asegúrate de que Express sepa dónde está la carpeta 'views'
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Usar las rutas de productos
app.use('/api/products', productRoutes);

// Usar las rutas del carrito y proceso de compra
app.use('/cart', cartRoutes);

// Usar la ruta de la página de inicio
app.get('/', homeController.getHomePage);  // Renderizar la página de inicio con el controlador

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