import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";
import Suppliers from "./SupplierModel.js"

const {DataTypes} = Sequelize;

const ProductSupplier = db.define('product_supplier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    delivery_time: {
        type: DataTypes.INTEGER, // días de entrega
        allowNull: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    freezeTableName: true,
});

// Relación Supplier -> ProductSupplier (1:N)
Suppliers.hasMany(ProductSupplier, {
    foreignKey: 'supplier_id'
});

ProductSupplier.belongsTo(Suppliers, {
    foreignKey: 'supplier_id',
    onDelete: 'CASCADE', // Si eliminas producto, se borran sus relaciones
    onUpdate: 'CASCADE'
});
// Relación Product -> ProductSupplier (1:N)
Products.hasMany(ProductSupplier, {
    foreignKey: 'product_id'
});

ProductSupplier.belongsTo(Products, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE', // Si eliminas proveedor, se borran sus relaciones
    onUpdate: 'CASCADE'
});

export default ProductSupplier;