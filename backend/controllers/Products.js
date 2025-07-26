import Product from "../models/ProductModel.js";
import { Op, where } from "sequelize";

export const getProducts = async(req, res) => {
    try {
        const products = await Product.findAll({
            attributes:['id','uuid','name'],
        })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
}