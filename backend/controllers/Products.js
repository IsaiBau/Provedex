// controllers/ProductController.js

import Product from "../models/ProductModel.js";
import Delivery from "../models/DeliveryModel.js";
import { Op, where } from "sequelize";
import Categories from "../models/CategoryModel.js";
import ProductSupplier from "../models/ProductSupplierModel.js";
import Suppliers from "../models/SupplierModel.js";

// Función auxiliar para manejar relaciones con proveedores
const handleProductSuppliers = async (productId, suppliersIds) => {
  // Eliminar relaciones existentes
  await ProductSupplier.destroy({
    where: { product_id: productId }
  });

  // Crear nuevas relaciones
  if (suppliersIds && suppliersIds.length > 0) {
    const suppliersRelations = suppliersIds.map(supplierId => ({
      product_id: productId,
      supplier_id: supplierId,
      price: null, // Puedes establecer valores por defecto o pedirlos en el formulario
      delivery_time: null
    }));

    await ProductSupplier.bulkCreate(suppliersRelations);
  }
};

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
        const product = await Product.findOne({
            where:{
                uuid: req.params.uuid
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
        if(!product) return res.status(404).json({msg: "No se encontró el producto"})
        
        // Formatear la respuesta para incluir array de suppliers_id
        const response = {
            ...product.toJSON(),
            suppliers_id: product.ProductSuppliers?.map(ps => ps.supplier_id) || []
        };
        
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createProduct = async(req, res) => {
    const { name, stock, min_stock, max_stock, id_category, suppliers_id } = req.body;
    
    try {
        // 1. Crear el producto
        const product = await Product.create({
            name: name,
            stock: stock,
            min_stock: min_stock,
            max_stock: max_stock,
            id_category: id_category
        });

        // 2. Manejar las relaciones con proveedores
        if (suppliers_id && suppliers_id.length > 0) {
            await handleProductSuppliers(product.id, suppliers_id);
        }

        res.status(201).json({ 
            msg: "Producto creado con éxito",
            productId: product.id
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateProduct = async(req, res) =>{
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        
        if(!product) return res.status(404).json({msg: "No se encontró el producto"});
        
        const {name, stock, min_stock, max_stock, id_category, suppliers_id} = req.body;
        
        // 1. Actualizar los datos básicos del producto
        await Product.update(
            {name, stock, min_stock, max_stock, id_category},
            { where: { uuid: product.uuid } }
        );

        // 2. Actualizar las relaciones con proveedores
        if (suppliers_id) {
            await handleProductSuppliers(product.id, suppliers_id);
        }

        res.status(200).json({ msg: "Producto actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { uuid: req.params.uuid },
            include: [{ model: Delivery, as: 'deliveries' }]
        });

        if (!product) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        if (product.deliveries && product.deliveries.length > 0) {
            return res.status(400).json({ 
                msg: "No se puede eliminar el producto porque está asociado a entregas existentes."
            });
        }

        // Eliminar primero las relaciones con proveedores
        await ProductSupplier.destroy({
            where: { product_id: product.id }
        });

        // Luego eliminar el producto
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