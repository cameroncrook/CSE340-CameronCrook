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

router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Route to edit inventory item
router.get("/edit/:itemId", invController.buildEditByInvId)

router.post(
    "/update/", 
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    invController.updateInventory
)

router.get("/delete/:itemId", invController.buildDeleteByInvId)

router.post(
    "/remove",
    invController.removeVehicle
)

module.exports = router;