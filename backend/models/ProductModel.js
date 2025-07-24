// models/product.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Categories from "./CategoryModel.js";

const {DataTypes} = Sequelize;

const Products = db.define('products', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    min_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    max_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    id_category: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

Categories.hasMany(Products, {foreignKey: 'id_category', onDelete: 'SET NULL', onUpdate: 'CASCADE'});
Products.belongsTo(Categories, {foreignKey: 'id_category'});

export default Products;