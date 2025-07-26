import Supplier from "../models/SupplierModel.js";
import { Op, where } from "sequelize";

export const getSuppliers = async(req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            attributes:['id','uuid','name'],
        })
        res.status(200).json(suppliers)
    } catch (error) {
        res.status(500).json(error)
    }
}