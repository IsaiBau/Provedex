import { request } from "express";
import User from "../models/UserModel.js";
import argon2 from "argon2";
export const Login = async(req, res) => {
    try {
        // Verifica que el cuerpo de la solicitud es válido
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({msg: "Datos de entrada inválidos"});
        }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        
        if (!user) {
            return res.status(404).json({msg: "Usuario no encontrado"});
        }
        
        // Verifica la contraseña
        const match = await argon2.verify(user.password, req.body.password);
        if (!match) {
            return res.status(400).json({msg: "Contraseña incorrecta"});
        }
        
        // Establece la sesión
        req.session.userId = user.uuid;
        
        // Devuelve los datos del usuario (sin password)
        res.status(200).json({
            id: user.id,
            uuid: user.uuid,
            name: user.name,
            rol: user.rol,
            email: user.email
        });
    } catch (error) {
        console.error("Error en Login:", error);
        res.status(500).json({msg: "Error interno del servidor"});
    }
}

export const Me = async(req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Por favor inicia sesión"});
    }
    const user = await User.findOne({
        attributes:['id','uuid', 'name', 'rol','email'],
        where:{
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "Usuario no encontrado"});
    res.status(200).json(user)
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "No se pudo cerrrar sesión"})
        res.status(200).json({msg: "Se ha cerrado sesión!"})
    })
}   