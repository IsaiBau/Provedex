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

export const getDeliveryById = (req, res) =>{
    
}

export const createDelivery = (req, res) =>{
    
}

export const updateDelivery = (req, res) =>{
    
}

export const deleteDelivery = (req, res) =>{
    
}