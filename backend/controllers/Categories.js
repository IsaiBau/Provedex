import Categories from "../models/CategoryModel.js";
import { Op, where } from "sequelize";

export const getCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll({
            attributes:['id','uuid','name'],
        })
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json(error)
    }
};

export const getCategoryById = async(req, res) =>{
    try {
        const category = await Categories.findOne({
            where:{
                uuid: req.params.uuid
            }
        })
        if(!category) return res.status(404).json({msg: "No se encontró la categoría"})
        const respose = await Categories.findOne({
                attributes:['id','uuid','name'],
                where:{
                    uuid: category.uuid
                }
            })
        res.status(200).json(respose)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createCategory = async(req, res) => {
    const {name} = req.body;
    try {
        await Categories.create({
            name: name
        });
        res.status(200).json({msg: "Categoría agregada"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const updateCategory = async(req, res) =>{
    try {
        const category = await Categories.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        const {name} = req.body;
        if(!category) return res.status(404).json({msg: "No se encotro la categoria"})
        await Categories.update({name},{
            where:{
                uuid: category.uuid
            }
        })

        res.status(200).json({ msg: "Categoria actualizada" });
    } catch (error) {
        console.log(res)
        res.status(500).json({ msg: error.message });
    }
}

export const deleteCategory = async(req, res) =>{
    try {
        const category = await Categories.findOne({
            where:{
                uuid: req.params.uuid
            }
        })
        await Categories.destroy({
            where:{
                uuid: category.uuid
            }
        })
        res.status(200).json({msg: "Entrega eliminada con exito!"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}