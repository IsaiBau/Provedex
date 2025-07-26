import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import DeliveryHistories from "./DeliveryHistoryModel.js";
import Products from "./ProductModel.js";
import Suppliers from "./SupplierModel.js";

const {DataTypes} = Sequelize;

const Deliveries = db.define('deliveries', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    delivery_date: {
        type: DataTypes.DATEONLY, 
        allowNull: false
    },
    delivery_time: {
        type: DataTypes.TIME, 
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Pending',
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
});
DeliveryHistories.belongsTo(Deliveries, {
    foreignKey: 'delivery_id',
    onDelete: 'CASCADE'
});

Deliveries.hasMany(DeliveryHistories, {
    foreignKey: 'delivery_id',
    onDelete: 'CASCADE'
});

Deliveries.belongsTo(Products, {
    foreignKey: 'product_id',
});

Products.hasMany(Deliveries, {
    foreignKey: 'product_id',
});

Deliveries.belongsTo(Suppliers, {
    foreignKey: 'supplier_id',
});

Suppliers.hasMany(Deliveries, {
    foreignKey: 'supplier_id',
});
export default Deliveries;