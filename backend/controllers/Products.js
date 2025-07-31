import Product from "../models/ProductModel.js";
import { Op, where } from "sequelize";
import Categories from "../models/CategoryModel.js";
import ProductSupplier from "../models/ProductSupplierModel.js";
import Suppliers from "../models/SupplierModel.js";

export const getProducts = async(req, res) => {
    try {
        const products = await Product.findAll({
            attributes:['id','uuid','name', 'stock', 'min_stock', 'max_stock', 'id_category'],
            include: [
                {
                    model: Categories,
                    attributes:['id','uuid','name']
                },
                {
                    model: ProductSupplier,
                    attributes: ['id','uuid','price','delivery_time', 'product_id', 'supplier_id'],
                    include:[{
                        model: Suppliers,
                        attributes: ['id','uuid','name']
                    }]
                }
            ]
        })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
}
/* 
export const getDeliveryById = async(req, res) =>{
    try {
        const delivery = await Delivery.findOne({
            where:{
                uuid: req.params.uuid
            }
        })
        if(!delivery) return res.status(404).json({msg: "No se encontró la entrega"})
        const respose = await Delivery.findOne({
                attributes:['uuid','delivery_date', 'delivery_time','status', 'title', 'product_id', 'supplier_id'],
                where:{
                    uuid: delivery.uuid
                }, 
                include: [
                    {
                        model: Product,
                        attributes: ['id','uuid', 'name'],
                        as: 'product' // Usa el mismo alias que en tu relación
                    },
                    {
                        model: Supplier,
                        attributes: ['id','uuid', 'name'],
                        as: 'supplier' // Usa el mismo alias que en tu relación
                    }
                ],
            })
        res.status(200).json(respose)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createDelivery = async(req, res) => {
    const {delivery_date, delivery_time, status, title, product_id, supplier_id} = req.body;
    try {
        await Delivery.create({
            delivery_date: delivery_date,
            delivery_time: delivery_time,
            status:status,
            title:title,
            product_id:product_id,
            supplier_id:supplier_id
        });
        res.status(200).json({msg: "Entrega agregada"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const updateDelivery = async(req, res) =>{
    try {
        const delivery = await Delivery.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        const {delivery_date, delivery_time, status, title, product_id, supplier_id} = req.body;
        if(!delivery) return res.status(404).json({msg: "No se encotro la entrega"})
        await Delivery.update({delivery_date, delivery_time, status, title, product_id, supplier_id},{
            where:{
                uuid: delivery.uuid
            }
        })

        res.status(200).json({ msg: "Entrega actualizada" });
    } catch (error) {
        console.log(res)
        res.status(500).json({ msg: error.message });
    }
}

export const deleteDelivery = async(req, res) =>{
    try {
        const delivery = await Delivery.findOne({
            where:{
                uuid: req.params.uuid
            }
        })
        await Delivery.destroy({
            where:{
                uuid: delivery.uuid
            }
        })
        res.status(200).json({msg: "Entrega eliminada con exito!"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const updateDeliveryStatus = async(req, res) => {
    try {
        const delivery = await Delivery.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        
        if(!delivery) return res.status(404).json({msg: "No se encontró la entrega"});
        
        const { status } = req.body;
        if(!['Pending', 'Canceled', 'Rescheduled', 'Completed'].includes(status)) {
            return res.status(400).json({msg: "Estado no válido"});
        }

        await Delivery.update({ status }, {
            where: { uuid: delivery.uuid }
        });

        res.status(200).json({ msg: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
    */