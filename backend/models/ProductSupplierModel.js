import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Products from "./ProductModel.js";
import Suppliers from "./SupplierModel.js"

const {DataTypes} = Sequelize;

const ProductSupplier = db.define('product_supplier', {
    id_product_supplier: {
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
Products.belongsToMany(Suppliers, {
    through: ProductSupplier,
    foreignKey: 'product_id',
    onDelete: 'CASCADE', // Si eliminas producto, se borran sus relaciones
    onUpdate: 'CASCADE'
});

Suppliers.belongsToMany(Products, {
    through: ProductSupplier,
    foreignKey: 'supplier_id',
    onDelete: 'CASCADE', // Si eliminas proveedor, se borran sus relaciones
    onUpdate: 'CASCADE'
});
export default ProductSupplier;