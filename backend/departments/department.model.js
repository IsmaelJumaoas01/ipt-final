const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Department = sequelize.define('Department', {
        name: { 
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true,
            index: {
                unique: true,
                name: 'department_name_unique'
            }
        },
        description: { 
            type: DataTypes.STRING, 
            allowNull: true 
        }
    }, {
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['name'],
                name: 'department_name_unique'
            }
        ]
    });
    return Department;
}; 