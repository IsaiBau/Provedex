import { request } from "express";
import User from "../models/UserModel.js";
import argon2 from "argon2";
export const Login = async(req, res) =>{
    const user = await User.findOne({
        where:{
            name: req.body.name
        }
    });
    if(!user) return res.status(404).json({msg: "Usuario no encontrado"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Contraseña incorrecta"});
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const id = user.id;
    const name = user.name;
    const role = user.role;
    const password = user.password;
    res.status(200).json({id, uuid, name,role, password});
}

export const Me = async(req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Por favor inicia sesión"});
    }
    const user = await User.findOne({
        attributes:['id','uuid', 'name', 'role', 'password'],
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