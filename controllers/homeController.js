exports.getHomePage = (req, res) => {
    res.render('home', { title: 'Página de Inicio', message: 'Bienvenido a nuestra aplicación' });
};