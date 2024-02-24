const utilities = require("../utilities/")
const errorController = {}

errorController.GetErrorView = async function(req, res, next) {
    const nav = await utilities.getNav()

    const err = new Error("Intentional Error for Testing Purposes")
    err.status = 500;

    throw err;

    res.render("index", {title: "Home", nav})
}

module.exports = errorController

