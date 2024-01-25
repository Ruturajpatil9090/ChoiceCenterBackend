const EmployeeData = require('../models/SalaryModels');
const sequelize = require('../config/database'); // Adjust the path accordingly
const CircularJSON = require('circular-json');

const { Op } = require('sequelize');



const employeeDataController = {

  getLastRecordBySalaryNo: async (req, res) => {
    const salaryNo = req.query.salaryNo;
    console.log(salaryNo)
    try {
      // Find the last record in the database based on salary_no
      const lastRecord = await EmployeeData.findAll({
        where: { salary_no: salaryNo },
      });

      if (!lastRecord) {
        return res.status(404).json({ error: 'No records found in the database' });
      }

      res.status(200).json({ lastRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  getSalaryNo: async (req, res) => {
    try { 
      // Find the last record in the database based on salary_no
      const lastRecord = await EmployeeData.findOne({
        order: [['salary_no', 'DESC']],
      });

      if (!lastRecord ) {
        return res.status(200).json(1);
      }

      if (lastRecord =="") {
        return res.status(404).json({ error: 'No records found in the database'});
      }

      res.status(200).json({ lastRecord });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  getAllSalaryNoUtility : async (req, res) => {

    const t = await sequelize.transaction();
    
    try {
      const salaryNoData = await EmployeeData.findAll({
        attributes: [
          'salary_no',
          [sequelize.fn('MAX', sequelize.col('userId')), 'userId'],
          [sequelize.fn('MAX', sequelize.col('id')), 'id'],
          [sequelize.fn('MAX', sequelize.col('salaryDate')), 'salaryDate'],
          [sequelize.fn('MAX', sequelize.col('daysInMonth')), 'daysInMonth'],
          [sequelize.fn('MAX', sequelize.col('Employee_name')), 'Employee_name'],
          [sequelize.fn('MAX', sequelize.col('totalMonthlySalary')), 'totalMonthlySalary'],
          [sequelize.fn('MAX', sequelize.col('netRatePerHour')), 'netRatePerHour'],
        ],
        group: ['salary_no'],
        order: [['salary_no', 'ASC']],
        transaction: t, // Pass the transaction instance to the query
      });
  
      if (!salaryNoData || salaryNoData.length === 0) {
        await t.rollback(); // Rollback the transaction
        return res.status(404).json({ error: 'No records found in the database' });
      }
  
      await t.commit(); // Commit the transaction
  
      res.status(200).json({ salaryNoData });
    } catch (error) {
      console.error(error);
      await t.rollback(); // Rollback the transaction in case of an error
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  saveDataToDatabase: async (req, res) => {
    try {
      const jsonData = req.body; 
  
      if (!Array.isArray(jsonData)) {
        return res.status(400).json({ error: 'Invalid data format. Expecting an array.' });
      }
  
      // Find the max salary_no from the database
      const maxSalaryNo = await EmployeeData.max('salary_no');
  
      // Increment the max salary_no by 1 to get the next available salary_no
      const nextSalaryNo = (maxSalaryNo || 0) + 1;
  
      // Assuming your data structure matches the model
      const bulkData = jsonData.map(item => ({
        salary_no: nextSalaryNo,
        day: item.day,
        date: item.date,
        totalMonthyHours: item.totalMonthyHours,
        totalMonthlyDeduction: item.totalMonthlyDeduction,
        totalHours: item.totalHours,
        Employee_name:item.Employee_name,
        netRatePerHour: item.netRatePerHour,
        perDaySalary: item.perDaySalary,
        userId: item.userId,
        salaryDate:item.salaryDate,
        totalDeduction:parseFloat(item.totalDeduction),
        Basic_salary:item.Basic_salary,
        logTime1: item.logTime1,
        outTime1: item.outTime1,
        logTime2: item.logTime2,
        outTime2: item.outTime2,
        logTime3: item.logTime3,
        outTime3: item.outTime3,
        logTime4: item.logTime4,
        outTime4: item.outTime4,
        totalMonthlySalary: item.totalMonthlySalary,
        daysInMonth: item.daysInMonth,
        EmployeeHours:item.EmployeeHours,
        Late:item.Late,
        MonthlyOff:item.MonthlyOff,
        MonthlySundayOff:item.MonthlySundayOff
      }));
  
      console.log('+++++', bulkData);
  
      // Create the employee data records in bulk
      const savedData = await EmployeeData.bulkCreate(bulkData);
  
      res.status(201).json({ message: 'Data saved to the database successfully', savedData });
    } catch (error) {
      console.error(error);
  
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  

  editData: async (req, res) => {
    const recordId = req.params.id;
    const updatedData = req.body;

    try {
      // Find the record in the database based on the provided ID
      const existingRecord = await EmployeeData.findByPk(recordId);

      if (!existingRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }

      // Update the existing record with the new data
      await existingRecord.update(updatedData);

      res.status(200).json({ message: 'Record updated successfully', updatedData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },



  UpdateSugarPurchase: async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const { updateData } = req.body;
      const { salary_no } = req.query;
  
      // Update Head
      const [updatedHeadCount, updatedHead] = await EmployeeData.update(updateData, {
        where: {
          salary_no,
        },
        transaction: t,
      });
  
      const updatedDetails = updateData || []; // Assuming details are part of updateData
  
      // Update Details
      for (const item of updatedDetails) {
        const { id, ...updateData } = item; // Destructure the id from item
        const [updatedDetailCount] = await EmployeeData.update(updateData, {
          where: { id },
          transaction: t,
        });
  
        if (updatedDetailCount !== 1) {
          // If the update fails for any detail, roll back the transaction
          await t.rollback();
          return res.status(404).json({ error: 'Detail not found or could not be updated' });
        }
      }
  
      // If everything is successful, commit the transaction
      await t.commit();
  
      res.status(201).json({
        message: 'Data updated successfully',
        updatedDetails: updatedHead,
      });
    } catch (error) {
      console.error(error);
  
      // Roll back the transaction if any operation fails
      await t.rollback();
  
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  },


  //delete the record on salary No
   deleteRecordsBySalaryNo : async (req, res) => {
    const salaryNo = req.params.salary_no;
  
    try {
      // Delete records in the database based on salary_no
      const deletedRecordsCount = await EmployeeData.destroy({
        where: { salary_no: salaryNo },
      });
  
      if (deletedRecordsCount === 0) {
        return res.status(404).json({ error: 'No records found for deletion' });
      }
  
      res.status(200).json({ message: 'Records deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  


  

  };

  
module.exports = employeeDataController;