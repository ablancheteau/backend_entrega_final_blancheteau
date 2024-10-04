const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        // Configuración del transporte (aquí utilizamos un servicio de prueba de Nodemailer)
        let transporter = nodemailer.createTransport({
            service: 'gmail',  // Puedes cambiar esto por cualquier otro servicio de correo
            auth: {
                user: process.env.EMAIL_USER,  // Tu correo electrónico
                pass: process.env.EMAIL_PASS   // Tu contraseña
            }
        });

        // Opciones del correo
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        // Envío del correo
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado a: ' + to);
    } catch (error) {
        console.error('Error al enviar el correo: ', error);
    }
};

module.exports = sendEmail;
