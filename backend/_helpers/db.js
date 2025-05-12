const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {

    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    

    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    

    // New models
    db.Employee = require('../employees/employee.model')(sequelize);
    db.Department = require('../departments/department.model')(sequelize);
    db.Request = require('../requests/request.model')(sequelize);
    db.RequestItem = require('../requests/request-item.model')(sequelize);
    db.Workflow = require('../workflows/workflow.model')(sequelize);
    

    // Associations
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.Employee.belongsTo(db.Account, { foreignKey: 'userId', as: 'user' });
    db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId' });
    db.Department.hasMany(db.Employee, { foreignKey: 'departmentId' });

    db.Request.belongsTo(db.Employee, { foreignKey: 'employeeId' });
    db.Request.hasMany(db.RequestItem, { foreignKey: 'requestId' });
    db.RequestItem.belongsTo(db.Request, { foreignKey: 'requestId' });

    db.Workflow.belongsTo(db.Employee, { foreignKey: 'employeeId' });

    await sequelize.sync({ alter: true });
}