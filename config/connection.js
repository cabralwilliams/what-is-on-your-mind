//Get access to environment variables
require("dotenv").config();

//Import sequelize
const Sequelize = require("sequelize");

//Create database connection
let sequelize;

if(process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, 'root', process.env.MYSQL_PASSWORD, {
        host: "localhost",
        dialect: "mysql",
        port: 3306
    });
}

module.exports = sequelize;