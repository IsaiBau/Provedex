import nodemailer from "nodemailer";
import User from "../models/UserModel.js";
import argon2 from "argon2";
import generarCodigo from "./GenerateCode.js";
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const codigos = {};

export const enviarCodigo = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "Email no registrado" });
    }

    const codigo = generarCodigo();
    codigos[email] = {
      codigo,
      expiresAt: Date.now() + 15 * 60 * 1000 //15 minutos de expiracion
    };

    //configurar y enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña - PROVEDEX',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Tu código de verificación es: <strong>${codigo}</strong></p>
        <p>Este código expirará en 15 minutos.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Código enviado al correo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar el código, verifique su email" });
  }
};

export const verificarCodigo = async (req, res) => {
  const { email, codigo } = req.body;
  
  try {
    const storedCode = codigos[email];
    
    if (!storedCode || storedCode.codigo !== codigo) {
      return res.status(400).json({ msg: "Código inválido" });
    }
    
    if (Date.now() > storedCode.expiresAt) {
      delete codigos[email];
      return res.status(400).json({ msg: "Código expirado" });
    }
    
    res.status(200).json({ msg: "Código válido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al verificar el código" });
  }
};

export const actualizarPassword = async (req, res) => {
  const { email, codigo, newPassword } = req.body;
  
  try {
    //verificar código primero
    const storedCode = codigos[email];
    
    if (!storedCode || storedCode.codigo !== codigo) {
      return res.status(400).json({ msg: "Código inválido" });
    }
    
    if (Date.now() > storedCode.expiresAt) {
      delete codigos[email];
      return res.status(400).json({ msg: "Código expirado" });
    }
    
    //buscar usuario y actualizar contraseña
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
    const hashedPassword = await argon2.hash(newPassword);
    await user.update({ password: hashedPassword });
    
    //dliminar código usado
    delete codigos[email];
    
    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar contraseña" });
  }
};