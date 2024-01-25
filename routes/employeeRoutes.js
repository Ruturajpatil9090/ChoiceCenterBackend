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
router.get('/getfirstnavigationemployee', EmployeeControllers.getFirstNavigation);
router.get('/getlastnavigationemployee', EmployeeControllers.getLastNavigation);
router.get('/getpreviousnavigationemployee/:currentEmployeeCode', EmployeeControllers.getPreviousNavigation);
router.get('/getnextnavigationemployee/:currentEmployeeCode', EmployeeControllers.getNextNavigation);


//user creation routes
router.get('/getallusers', UserCreation.getAllUserCreations);
router.get('/lastusercode', UserCreation.getLastUserCreation);
router.get('/getlastrecordbyuserid', UserCreation.getLastUserCreationAll);
router.post('/insertnewuser', UserCreation.createUserCreation);
router.put('/updateuser/:employeeCode', UserCreation.updateUserCreation);
router.delete('/deleteuser/:employeeCode', UserCreation.deleteUserCreation);
router.post('/loginuser', UserCreation.LoginUser);
router.get('/getfirstnavigation', UserCreation.getFirstNavigation);
router.get('/getlastnavigation', UserCreation.getLastNavigation);
router.get('/getpreviousnavigation/:currentEmployeeCode', UserCreation.getPreviousNavigation);
router.get('/getnextnavigation/:currentEmployeeCode', UserCreation.getNextNavigation);



//salary routes
router.post('/insertjsondata', SalaryData.saveDataToDatabase);
router.put('/editsalarydata', SalaryData.editData);
router.get('/getlastrecord', SalaryData.getLastRecordBySalaryNo);
router.get('/getlastsalaryno', SalaryData.getSalaryNo);
router.get('/getAllUtility', SalaryData.getAllSalaryNoUtility);
router.delete('/deleteRecords/:salary_no', SalaryData.deleteRecordsBySalaryNo);


router.put('/updatesalary', SalaryData.UpdateSugarPurchase);






module.exports = router;
