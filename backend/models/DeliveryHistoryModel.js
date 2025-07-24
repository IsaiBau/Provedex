import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const DeliveryHistories = db.define('delivery_histories', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    previous_date: {
        type: DataTypes.DATEONLY,
        allowNull: true 
    },
    previous_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    new_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Pending', 'Canceled', 'Rescheduled', 'Completed']]
        }
    },
    change_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    delivery_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false // No necesitamos createdAt/updatedAt porque tenemos change_date
});

export default DeliveryHistories;