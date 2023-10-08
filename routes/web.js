const express = require('express')
const multer  = require('multer');
const UserController = require('../controllers/UserController');
const Auth = require('../middleware/Auth')
const GuestAuth = require('../middleware/GuestAuth');
const SADashboardController = require('../controllers/SuperAdmin/SADashboardController');
const SAClientController = require('../controllers/SuperAdmin/SAClientController');
const DashboardController = require('../controllers/Admin/DashboardController');
const CustomerController = require('../controllers/Admin/CustomerController');
const GeneralSettingsController = require('../controllers/Admin/GeneralSettingsController');
const router = express.Router()

//multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Destination folder where files will be stored
    //   cb(null, 'public/uploads/');  // Destination folder where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Unique filename
    }
});

const upload = multer({ storage: storage });



//UserController
router.get('/sabkabaap',GuestAuth,UserController.register)
router.post('/userInsert',GuestAuth,UserController.userInsert)
router.get('/',GuestAuth,UserController.login)
router.post('/loginVerify',UserController.loginVerify)
router.get('/forgetPassword',GuestAuth,UserController.forgetPassword)
router.post('/checkEMailForgetPasswordAndSendOtp',GuestAuth,UserController.checkEMailForgetPasswordAndSendOtp)
router.get('/otpVerificationForForgetPassword',GuestAuth,UserController.otpVerificationForForgetPassword)
router.post('/verifyOTPForForgetPassword',GuestAuth,UserController.verifyOTPForForgetPassword)
router.get('/newPassword',GuestAuth,UserController.newPassword)
router.post('/updatePasswordForForgetPassword',GuestAuth,UserController.updatePasswordForForgetPassword)
router.get('/logout',UserController.logout)


//SADashboardController
router.get('/superAdmin/dashboard',Auth,SADashboardController.dashboard)



//SAClientDashboard
router.get('/superAdmin/client',Auth,SAClientController.index)
router.get('/superAdmin/addClient',Auth,SAClientController.addClient)
router.post('/superAdmin/clientInsert',Auth,SAClientController.clientInsert)
router.get('/superAdmin/changeClientStatus/:id',Auth,SAClientController.changeClientStatus)
router.get('/superAdmin/editClient/:id',Auth,SAClientController.editClient)
router.post('/superAdmin/clientUpdate/:id',Auth,SAClientController.clientUpdate)
router.get('/superAdmin/deleteClient/:id',Auth,SAClientController.deleteClient)



//SADashboardController
router.get('/admin/dashboard',Auth,DashboardController.dashboard)



//CustomerController
router.get('/admin/customer',Auth,CustomerController.index)
router.get('/admin/addCustomer',Auth,CustomerController.addCustomer)
router.post('/admin/customerInsert',Auth,CustomerController.customerInsert)
router.get('/admin/editCustomer/:id',Auth,CustomerController.editCustomer)
router.post('/admin/customerUpdate/:id',Auth,CustomerController.customerUpdate)
router.get('/admin/deleteCustomer/:id',Auth,CustomerController.deleteCustomer)
router.get('/admin/deleteCustomerPermanently/:id',Auth,CustomerController.deleteCustomerPermanently)



//GeneralSettingsController
router.get('/admin/updateProfile',Auth,GeneralSettingsController.updateProfile)
router.post('/admin/updateProfile/:id',Auth,GeneralSettingsController.updateUserProfile)



module.exports = router