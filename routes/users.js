const express = require('express');
const router = express.Router();
const { getUsers, deleteInactiveUsers, updateUserRole, deleteUser } = require('../controllers/usersController');

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// Ruta para eliminar usuarios inactivos y notificar por correo
router.delete('/', async (req, res) => {
    try {
        const deletedUsers = await deleteInactiveUsers();
        res.json({ message: 'Usuarios eliminados por inactividad', deletedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
    }
});

// Ruta para modificar el rol de un usuario (solo admin)
router.put('/:id/role', async (req, res) => {
    const userId = req.params.id;
    const { newRole } = req.body;
    
    try {
        const updatedUser = await updateUserRole(userId, newRole);
        res.json({ message: 'Rol del usuario actualizado', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
    }
});

// Ruta para eliminar un usuario
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await deleteUser(userId);
        res.json({ message: 'Usuario eliminado', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

module.exports = router;
