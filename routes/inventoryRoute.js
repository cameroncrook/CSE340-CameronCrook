// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

// Route to management
router.get("/", invController.buildManagementView);

// Route to Add New Classification
router.get("/add-classification", invController.buildAddClassification);
router.post(
    "/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addNewClassiification
);

// Route to add new inventory item
router.get("/add-inventory", invController.buildAddInventory)
router.post(
    "/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addNewInventory
)

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build item details view
router.get("/detail/:itemId", invController.buildByInvId);

module.exports = router;