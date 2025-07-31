import Product from "../models/ProductModel.js";
import Delivery from "../models/DeliveryModel.js";
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
                    attributes:['id','uuid','name','color']
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

export const getProductById = async(req, res) =>{
    try {
        const category = await Product.findOne({
            where:{
                uuid: req.params.uuid
            }
        })
        if(!category) return res.status(404).json({msg: "No se encontró el producto"})
        const respose = await Product.findOne({
                attributes:['id','uuid','name', 'stock', 'min_stock', 'max_stock', 'id_category'],
                where:{
                    uuid: category.uuid
                }, 
                include: [
                    {
                        model: Categories,
                        attributes:['id','uuid','name','color']
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
        res.status(200).json(respose)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createProduct = async(req, res) => {
    const {name,stock, min_stock, max_stock, id_category} = req.body;
    try {
        await Product.create({
            name: name,
            stock: stock,
            min_stock:min_stock,
            max_stock:max_stock,
            id_category:id_category
        });
        res.status(200).json({msg: "Producto agregado"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const updateProduct = async(req, res) =>{
    try {
        const category = await Product.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        const {name,stock, min_stock, max_stock, id_category} = req.body;
        if(!category) return res.status(404).json({msg: "No se encotro el producto"})
        await Product.update({name,stock, min_stock, max_stock, id_category},{
            where:{
                uuid: category.uuid
            }
        })

        res.status(200).json({ msg: "Producto actualizado" });
    } catch (error) {
        console.log(res)
        res.status(500).json({ msg: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { uuid: req.params.uuid },
            include: [{ model: Delivery, as: 'deliveries' }] // Asume que tienes esta relación definida en tu modelo
        });

        if (!product) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        // Verifica si el producto tiene entregas asociadas
        if (product.deliveries && product.deliveries.length > 0) {
            return res.status(400).json({ 
                msg: "No se puede eliminar el producto porque está asociado a entregas existentes."
            });
        }

        // Si no hay entregas, elimina el producto
        await Product.destroy({ where: { uuid: product.uuid } });
        return res.status(200).json({ msg: "Producto eliminado con éxito" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const updateProductStock = async(req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        
        if(!product) return res.status(404).json({msg: "No se encontró el producto"});
        
        const { stock } = req.body;
        await Product.update({ stock }, {
            where: { uuid: product.uuid }
        });

        res.status(200).json({ msg: "Stock actualizado" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}