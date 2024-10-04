const User = require('../models/user');  // Suponiendo que tienes un modelo de usuario
const sendEmail = require('../utils/sendEmail');  // Suponiendo que tienes una función para enviar correos

// Obtener todos los usuarios (solo devuelve datos importantes como nombre, correo y rol)
const getUsers = async () => {
    try {
        const users = await User.find({}, 'name email role');
        return users;
    } catch (error) {
        throw new Error('Error al obtener usuarios');
    }
};

// Eliminar usuarios inactivos (ejemplo: inactivos por más de 2 días)
const deleteInactiveUsers = async () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);  // Dos días en milisegundos
    try {
        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });
        const deletedUsers = [];

        for (const user of inactiveUsers) {
            await User.findByIdAndDelete(user._id);
            await sendEmail(user.email, 'Tu cuenta ha sido eliminada', 'Tu cuenta ha sido eliminada por inactividad');
            deletedUsers.push(user);
        }

        return deletedUsers;
    } catch (error) {
        throw new Error('Error al eliminar usuarios inactivos');
    }
};

// Actualizar el rol de un usuario
const updateUserRole = async (userId, newRole) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('Usuario no encontrado');
        
        user.role = newRole;
        await user.save();
        
        return user;
    } catch (error) {
        throw new Error('Error al actualizar el rol del usuario');
    }
};

// Eliminar un usuario
const deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) throw new Error('Usuario no encontrado');
        
        return user;
    } catch (error) {
        throw new Error('Error al eliminar el usuario');
    }
};

module.exports = {
    getUsers,
    deleteInactiveUsers,
    updateUserRole,
    deleteUser
};