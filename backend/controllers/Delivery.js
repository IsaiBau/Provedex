import Delivery from "../models/DeliveryModel.js";
import Product from "../models/ProductModel.js";
import Supplier from "../models/SupplierModel.js";
import { Op, where } from "sequelize";

export const getDeliveries = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        
        // Configurar filtros
        const whereClause = {};
        
        if (startDate && endDate) {
            whereClause.delivery_date = {
                [Op.between]: [startDate, endDate]
            };
        }
        
        if (status) {
            whereClause.status = status;
        }
        
        const deliveries = await Delivery.findAll({
            where: whereClause,
            attributes: ['uuid', 'delivery_date', 'delivery_time', 'status', 'title'],
            include: [
                {
                    model: Product,
                    attributes: ['uuid', 'name'],
                    as: 'product' // Usa el mismo alias que en tu relación
                },
                {
                    model: Supplier,
                    attributes: ['uuid', 'name'],
                    as: 'supplier' // Usa el mismo alias que en tu relación
                }
            ],
            order: [
                ['delivery_date', 'ASC'],
                ['delivery_time', 'ASC']
            ]
        });
        
        res.status(200).json(deliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        res.status(500).json({ message: "Error al obtener las entregas", error: error.message });
    }
};

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