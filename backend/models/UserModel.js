import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    rol: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
        email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
            notEmpty: true,
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
},{
    freezeTableName: true
});

export default Users;