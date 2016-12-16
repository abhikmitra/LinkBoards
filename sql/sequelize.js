var Sequelize = require('sequelize');
var DB_NAME = "linkBoard";
var DB_USER = "newuser";
var DB_PASSWORD = "password";
var DB_HOST = "localhost";

var sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            maxIdleTime: 120000
        },
        dialectOptions: {
            multipleStatements: true
        }
    });

exports.sequelize = sequelize;
exports.authenticate = function authenticate() {
    sequelize
        .authenticate()
        .then(function(err) {
            console.log('Connection has been established successfully.');
        })
        .catch(function (err) {
            console.log('Unable to connect to the database:', err);
        });
};