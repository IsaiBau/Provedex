import {Sequelize} from "sequelize"

const db = new Sequelize('provedex', 'sa', '12345678', {
    host: "localhost",
    dialect: "mssql"
});

export default db;