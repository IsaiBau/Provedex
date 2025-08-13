import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Notification = db.define("notification", {
  endpoint: {
    type: DataTypes.STRING(512),
    allowNull: false,
    unique: true
  },
  keys: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  freezeTableName: true
});

export default Notification;