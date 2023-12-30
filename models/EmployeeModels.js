const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database'); // Create this connection according to your database setup

const Employee = db.define('Employee_Masters', {
    Employee_Code: {
    type: DataTypes.INTEGER,
  },
  Employee_Name: {
    type: DataTypes.STRING,
  },
  Basic_Salary: {
    type: DataTypes.INTEGER,
  },
  Rate_Per_Hour: {
    type: DataTypes.FLOAT,
  },
  Date_Of_Joining: {
    type: DataTypes.DATE,
  },
  Resigned: {
    type: DataTypes.STRING,
  }
},

{
  freezeTableName: true,
  timestamps: false,
  
}
);
Employee.removeAttribute("id"),


module.exports = Employee;
