const sequelize = require('../config/database');
const UserCreation = require('../models/userCreationModels'); 
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

var secretKey = 'ChoiceCenter@123SeceretKey'

const userCreationController = {
  getAllUserCreations: async (req, res) => {
    try {
      const userCreations = await UserCreation.findAll();
      res.json(userCreations);
    } catch (error) {
      console.error('Error fetching user creations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getLastUserCreation: async (req, res) => {
    try {
      const lastUserCreation = await UserCreation.max('employeeCode');
      res.json({ lastUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  getLastUserCreationAll: async (req, res) => {
    try {
      const lastUserCreation = await UserCreation.findOne({
        order: [['employeeCode', 'DESC']],
      });
  
      res.json({ lastUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  


  createUserCreation: async (req, res) => {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const {
        employeeCode,
        userName,
        mobileNo,
        emailId,
        password,
        userType,
      } = req.body;

      // Find the maximum employeeCode in the database within the transaction
      const maxEmployeeCode = await UserCreation.max('employeeCode', { transaction });

      // Calculate the new employeeCode
      const newEmployeeCode = maxEmployeeCode ? maxEmployeeCode + 1 : 1;

      // Create the user creation record within the transaction
      const userCreation = await UserCreation.create(
        {
          employeeCode: newEmployeeCode,
          userName,
          mobileNo,
          emailId,
          password,
          userType,
        },
        { transaction }
      );

      // Commit the transaction if everything is successful
      await transaction.commit();

      return res.status(201).json({ message: 'User creation successful', userCreation });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUserCreation: async (req, res) => {
      let transaction;
  
      try {
        transaction = await sequelize.transaction();
  
        const { employeeCode } = req.params;
        const {
          userName,
          mobileNo,
          emailId,
          password,
          userType,
        } = req.body;
  
        // Check if the user with the given employeeCode exists
        const existingUserCreation = await UserCreation.findOne({
          where: { employeeCode },
          transaction,
        });
  
        if (!existingUserCreation) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Update the user creation record within the transaction
        await existingUserCreation.update(
          {
            userName,
            mobileNo,
            emailId,
            password,
            userType,
          },
          { transaction }
        );
  
        // Commit the transaction if everything is successful
        await transaction.commit();
  
        return res.status(200).json({ message: 'User update successful', userCreation: existingUserCreation });
      } catch (error) {
        // Rollback the transaction in case of an error
        if (transaction) {
          await transaction.rollback();
        }
  
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },



  deleteUserCreation: async (req, res) => {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const { employeeCode } = req.params;

      // Check if the user with the given employeeCode exists
      const existingUserCreation = await UserCreation.findOne({
        where: { employeeCode },
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



  LoginUser: async (req, res) => {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      // Find the user with the provided username and password
      const user = await UserCreation.findOne({
        where: {
          [Op.and]: [
            { emailId: username },
            { password: password },
          ],
        },
      });

      if (user) {
        // User is authenticated, generate a token
        const userType = user.userType;
        const userName = user.userName;;
        const token = jwt.sign({ username, userType }, secretKey, { expiresIn: '1h' }); 

        res.json({ token, userType,userName });
      } else {
        // Authentication failed
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getFirstNavigation: async (req, res) => {
    try {
      const firstUserCreation = await UserCreation.findOne({
        order: [['employeeCode', 'ASC']],
      });

      res.json({ firstUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getLastNavigation: async (req, res) => {
    try {
      const lastUserCreation = await UserCreation.findOne({
        order: [['employeeCode', 'DESC']],
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
  
      const previousUserCreation = await UserCreation.findOne({
        where: {
          employeeCode: {
            [Op.lt]: currentEmployeeCode,
          },
        },
        order: [['employeeCode', 'DESC']],
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
  
      const nextUserCreation = await UserCreation.findOne({
        where: {
          employeeCode: {
            [Op.gt]: currentEmployeeCode,
          },
        },
        order: [['employeeCode', 'ASC']],
      });
  
      res.json({ nextUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  
  
};

module.exports = userCreationController;
