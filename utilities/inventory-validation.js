const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory make."), // on error this message is sent.

        body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory model."), // on error this message is sent.

        body("inv_year")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory year."), // on error this message is sent.

        body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory description."), // on error this message is sent.

        body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory image."), // on error this message is sent.

        body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory thumbnail."), // on error this message is sent.

        body("inv_miles")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory miles."), // on error this message is sent.

        body("inv_price")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory price."), // on error this message is sent.
        
        body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a inventory color."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
        })
        return
    }
    next()
}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let classification_options = await utilities.getClassificationOptions()
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classification_options,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let classification_options = await utilities.getClassificationOptions()
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
        errors,
        title: "Edit Inventory",
        nav,
        classification_options,
        inv_id,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
        })
        return
    }
    next()
}

validate.checkRemoveData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let classification_options = await utilities.getClassificationOptions()
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/delete-confirmation", {
        errors,
        title: "Delete Inventory",
        nav,
        classification_options,
        inv_id,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
        })
        return
    }
    next()
}

module.exports = validate
