const sequelize = require('../config/database');
const Employee = require('../models/EmployeeModels'); 
const { Op } = require('sequelize');

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  getEmployeeByEmployeeCode: async (req, res) => {
    const { employeeCode } = req.params;
    try {
      const employee = await Employee.findOne({
        where: { Employee_Code: employeeCode },
      });
  
      if (employee) {
        res.json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  

  getLastEmployees: async (req, res) => {
    try {
      const lastEmployee = await Employee.max("Employee_Code");
  
      res.json({lastEmployee});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  getLastUserCreationAll: async (req, res) => {
    try {
      const lastUserCreation = await Employee.findOne({
        order: [['Employee_Code', 'DESC']],
      });
  
      res.json({ lastUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  
  createEmployee: async (req, res) => {
    try {
      const {
        Employee_Name,
        Basic_Salary,
        Rate_Per_Hour,
        Date_Of_Joining,
        Resigned,
        From_Time,
        To_Time
      } = req.body;
  
      // Find the maximum Employee_Code in the database
      const maxEmployeeCode = await Employee.max('Employee_Code');
  
      // Calculate the new Employee_Code
      const newEmployeeCode = maxEmployeeCode ? maxEmployeeCode + 1 : 1;
  
      const employee = await Employee.create({
        Employee_Code: newEmployeeCode,
        Employee_Name,
        Basic_Salary,
        Rate_Per_Hour,
        Date_Of_Joining,
        From_Time,
        To_Time,
        Resigned,
      });
  
      return res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }, createEmployee: async (req, res) => {
    let transaction; 

    try {
     
      transaction = await sequelize.transaction();

      const {
        Employee_Name,
        Basic_Salary,
        Rate_Per_Hour,
        Date_Of_Joining,
        From_Time,
        To_Time,
        Resigned,
      } = req.body;

      // Find the maximum Employee_Code in the database within the transaction
      const maxEmployeeCode = await Employee.max('Employee_Code', { transaction });

      // Calculate the new Employee_Code
      const newEmployeeCode = maxEmployeeCode ? maxEmployeeCode + 1 : 1;

      // Create the employee record within the transaction
      const employee = await Employee.create(
        {
          Employee_Code: newEmployeeCode,
          Employee_Name,
          Basic_Salary,
          Rate_Per_Hour,
          Date_Of_Joining,
          From_Time,
          To_Time,
          Resigned,
        },
        { transaction }
      );

      // Commit the transaction if everything is successful
      await transaction.commit();

      return res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },


  updateEmployee: async (req, res) => {
    let transaction; // Declare a variable to store the transaction

    try {
      // Start a Sequelize transaction
      transaction = await sequelize.transaction();

      const { Employee_Code, Employee_Name, Basic_Salary,Rate_Per_Hour, Date_Of_Joining, Resigned,From_Time,To_Time } = req.body;

      // Find the employee to update
      const existingEmployee = await Employee.findOne({ where: { Employee_Code }, transaction });

      if (!existingEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Update the employee record within the transaction
      existingEmployee.Employee_Name = Employee_Name;
      existingEmployee.Basic_Salary = Basic_Salary;
      existingEmployee.Rate_Per_Hour = Rate_Per_Hour;
      existingEmployee.Date_Of_Joining = Date_Of_Joining;
      existingEmployee.From_Time = From_Time;
      existingEmployee.To_Time = To_Time;
      existingEmployee.Resigned = Resigned;

      await existingEmployee.save({ transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();

      return res.status(200).json({ message: 'Employee updated successfully', employee: existingEmployee });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },


  deleteEmployee: async (req, res) => {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const { Employee_Code } = req.params;

      // Check if the user with the given employeeCode exists
      const existingUserCreation = await Employee.findOne({
        where: { Employee_Code },
        transaction,
      });

      if (!existingUserCreation) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete the user creation record within the transaction
      await existingUserCreation.destroy({ transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();

      return res.status(200).json({ message: 'User deletion successful' });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },



  // navigation API
getFirstNavigation: async (req, res) => {
  try {
    const firstUserCreation = await Employee.findOne({
      order: [['id', 'ASC']],
    });

    res.json({ firstUserCreation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

getLastNavigation: async (req, res) => {
  try {
    const lastUserCreation = await Employee.findOne({
      order: [['Employee_Code', 'DESC']],
    });

    res.json({ lastUserCreation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

getPreviousNavigation: async (req, res) => {
  try {
    const { currentEmployeeCode } = req.params;

    const previousUserCreation = await Employee.findOne({
      where: {
        Employee_Code: {
          [Op.lt]: currentEmployeeCode,
        },
      },
      order: [['Employee_Code', 'DESC']],
    });

    res.json({ previousUserCreation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

getNextNavigation: async (req, res) => {
  try {
    const { currentEmployeeCode } = req.params;

    const nextUserCreation = await Employee.findOne({
      where: {
        Employee_Code: {
          [Op.gt]: currentEmployeeCode,
        },
      },
      order: [['Employee_Code', 'ASC']],
    });

    res.json({ nextUserCreation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},



  

};

module.exports = employeeController;
