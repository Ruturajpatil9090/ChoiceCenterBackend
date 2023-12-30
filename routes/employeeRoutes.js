const express = require('express');
const EmployeeControllers = require('../Controllers/employeeController'); 
const UserCreation = require('../Controllers/userCreationController')
const SalaryData = require('../Controllers/SalaryController')

const router = express.Router();
router.get('/', EmployeeControllers.getAllEmployees);
router.get('/getlastemployee', EmployeeControllers.getLastEmployees);
router.get('/getlastEmployeeAll', EmployeeControllers.getLastUserCreationAll);
router.get('/singlerecord/:employeeCode', EmployeeControllers.getEmployeeByEmployeeCode);
router.post('/insert', EmployeeControllers.createEmployee);
router.put('/updateemployee', EmployeeControllers.updateEmployee);
router.delete('/deleteemployee/:Employee_Code', EmployeeControllers.deleteEmployee);


//user creation routes
router.get('/getallusers', UserCreation.getAllUserCreations);
router.get('/lastusercode', UserCreation.getLastUserCreation);
router.get('/getlastrecordbyuserid', UserCreation.getLastUserCreationAll);
router.post('/insertnewuser', UserCreation.createUserCreation);
router.put('/updateuser/:employeeCode', UserCreation.updateUserCreation);
router.delete('/deleteuser/:employeeCode', UserCreation.deleteUserCreation);
router.post('/loginuser', UserCreation.LoginUser);


//salary routes
router.post('/insertjsondata', SalaryData.saveDataToDatabase);
router.put('/editsalarydata', SalaryData.editData);
router.get('/getlastrecord', SalaryData.getLastRecordBySalaryNo);
router.get('/getlastsalaryno', SalaryData.getSalaryNo);
router.get('/getAllUtility', SalaryData.getAllSalaryNoUtility);


router.put('/updatesalary', SalaryData.UpdateSugarPurchase);






module.exports = router;
