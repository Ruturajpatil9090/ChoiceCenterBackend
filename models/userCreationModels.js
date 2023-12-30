const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const Users = db.define(
  "user_creation",
  {
    employeeCode: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
    },
    mobileNo: {
      type: DataTypes.INTEGER,
    },
    emailId: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.STRING,
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);
Users.removeAttribute("id"), 

(module.exports = Users);
