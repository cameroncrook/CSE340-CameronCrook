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

module.exports = router;