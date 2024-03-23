const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver account login view
* *************************************** */
async function buildAccountManage(req, res) {
    let nav = await utilities.getNav()
    
    res.render("account/accountManagement", {
        title: "You're logged in!",
        nav,
        errors: null,
        account: utilities.getHeaderAccount(req, res)
    })
}


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account: utilities.getHeaderAccount(req, res)
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account: utilities.getHeaderAccount(req, res)
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account: utilities.getHeaderAccount(req, res)
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account: utilities.getHeaderAccount(req, res)
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account: utilities.getHeaderAccount(req, res)
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account: utilities.getHeaderAccount(req, res),
      account_email,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
     }
    } catch (error) {
     return new Error('Access Forbidden')
    }
}

/* ****************************************
 *  build update view
 * ************************************ */
async function buildAccountUpdate(req, res) {
    let nav = await utilities.getNav()
    let account = await utilities.getHeaderAccount(req, res)

    res.render("account/update", {
        title: "Update Your Account",
        nav,
        errors: null,
        account: account,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email,
        account_id: account.account_id
    })
}

/* ****************************************
 *  Process update requests
 * ************************************ */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const regResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (regResult) {
        req.flash(
        "notice",
        "Your account has been updated"
        )

        const accountData = await accountModel.getAccountByEmail(account_email)

        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        res.status(201).render("account/update", {
            title: "Update Your Account",
            nav,
            errors: null,
            account: utilities.getHeaderAccount(req, res),
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update", {
            title: "Registration",
            nav,
            errors: null,
            account: utilities.getHeaderAccount(req, res),
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    }
}

async function changePassword(req, res) {
    let nav = await utilities.getNav()
    let account = await utilities.getHeaderAccount(req, res)
    const { account_password, account_id } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the update.')
        res.status(500).render("account/update", {
            title: "Update Your Account",
            nav,
            errors: null,
            account: account,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email,
            account_id: account.account_id
        })
    }

    const regResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (regResult) {
        req.flash(
        "notice",
        `Password has been changed`
        )
        res.status(201).render("account/update", {
            title: "Update Your Account",
            nav,
            errors: null,
            account: account,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email,
            account_id: account.account_id
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/update", {
            title: "Update Your Account",
            nav,
            errors: null,
            account: account,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email,
            account_id: account.account_id
        })
    }
}

/* ****************************************
 *  logout
 * ************************************ */
function logout(req, res) {
    res.clearCookie("jwt")

    return res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManage, logout, buildAccountUpdate, updateAccount, changePassword }