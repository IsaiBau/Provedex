import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";
import Suppliers from "./SupplierModel.js"

const {DataTypes} = Sequelize;

const ProductSupplier = db.define('product_supplier', {
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    delivery_time: {
        type: DataTypes.INTEGER, // días de entrega
        allowNull: true
    }
}, {
    freezeTableName: true,
});
Products.belongsToMany(Suppliers, {
    through: ProductSupplier,
    foreignKey: 'product_id',
    otherKey: 'supplier_id',
    onDelete: 'CASCADE', // Si eliminas producto, se borran sus relaciones
    onUpdate: 'CASCADE'
});

Suppliers.belongsToMany(Products, {
    through: ProductSupplier,
    foreignKey: 'supplier_id',
    otherKey: 'product_id',
    onDelete: 'CASCADE', // Si eliminas proveedor, se borran sus relaciones
    onUpdate: 'CASCADE'
});
export default ProductSupplier;