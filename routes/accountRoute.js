const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities/');

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManage))

router.get("/login", accountController.buildLogin)

router.get("/register", accountController.buildRegister)

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Update account routes
router.get("/update", utilities.checkLogin, accountController.buildAccountUpdate)

router.post(
  "/account-update", 
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  accountController.updateAccount
)

router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData,
  accountController.changePassword
)

router.get("/logout", accountController.logout)

// Manage Users
router.get("/manage-users", utilities.checkLogin, utilities.isAdmin, accountController.buildManageUsers)

router.post("/change-type", utilities.isAdmin, accountController.changeType)
router.post("/delete", utilities.isAdmin, accountController.deleteAccount)

module.exports = router;