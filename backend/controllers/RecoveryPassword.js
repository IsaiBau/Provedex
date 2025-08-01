import nodemailer from "nodemailer";
import generarCodigo from "./GenerateCode";
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const codigos = {};

const enviarCodigo = async (req, res) => {
  const { email } = req.body;
  const codigo = generarCodigo();
  codigos[email] = codigo;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Tu código de recuperación es: ${codigo}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Código enviado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar el correo');
  }
};
export default RecoveryPassword;