const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');  // Importa el controlador de inicio de sesión

const router = express.Router();

// Ruta POST para iniciar sesión
router.post('/login', loginUser);

// Ruta POST para manejar el registro de usuarios
router.post('/register', registerUser);

module.exports = router;
