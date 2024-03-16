const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const title = "Vehicle Management"
  const classificationSelect = await utilities.getClassificationOptions()

  res.render("./inventory/management", {
    title: title,
    nav,
    classificationOptions: classificationSelect,
    errors: null
  })
}

/* ***************************
 *  Add New Classification
 * ************************** */
invCont.addNewClassiification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash(
      "notice",
      `${classification_name} classification added...`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "failed to add new classification...")
    res.status(501).render("inventory/add-classification", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Add New Inventory
 * ************************** */
invCont.addNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classification_options = await utilities.getClassificationOptions()

  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)


  if (result) {
    req.flash(
      "notice",
      `${inv_make} ${inv_model} vehicle added...`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classification_options,
      errors: null,
    })
  } else {
    req.flash("notice", "failed to add new inventory...")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classification_options,
      errors: null,
    })
  }

}

/* ***************************
 *  buildAddClassification
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const title = "Add Classification"

  res.render("./inventory/add-classification.ejs", {
    title: title,
    nav,
    errors: null
  })
}

/* ***************************
 *  buildAddInventory
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const title = "Add Vehicle"

  let classification_options = await utilities.getClassificationOptions()

  res.render("./inventory/add-inventory.ejs", {
    title: title,
    nav,
    classification_options,
    errors: null
  })
}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId

  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  let title = "Oops!"
  if (data.length > 0) {
    title = `${data[0].classification_name} vehicles`
  }
  
  res.render("./inventory/classification", {
    title: title,
    nav,
    grid,
  })
}

/* ***************************
 *  Build item details view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.itemId 
  const data = await invModel.getInventoryDetailsByInvId(inv_id)

  let detailsView
  let title
  if (data.length > 0) {
    const vehicle = data[0]
    detailsView = await utilities.buildInvItemView(vehicle)
    title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  } else {
    detailsView = await utilities.buildInvItemView(null)
    title = 'Sorry!'
  }

  let nav = await utilities.getNav()
  res.render('./inventory/inventoryDetails', {
    title,
    nav,
    detailsView,
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Edit inventory view
 * ************************** */
invCont.buildEditByInvId = async function (req, res) {
  const inv_id = parseInt(req.params.itemId)

  let nav = await utilities.getNav()
  const title = "Add Vehicle"

  const itemResponse = await invModel.getInventoryDetailsByInvId(inv_id)
  const itemData = itemResponse[0]

  let classification_options = await utilities.getClassificationOptions(itemData.classification_id)

  res.render("./inventory/edit-inventory.ejs", {
    title: title,
    nav,
    classification_options,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Delete inventory view
 * ************************** */
invCont.buildDeleteByInvId = async function (req, res) {
  const inv_id = parseInt(req.params.itemId)

  let nav = await utilities.getNav()
  const title = "Delete Vehicle"

  const itemResponse = await invModel.getInventoryDetailsByInvId(inv_id)
  const itemData = itemResponse[0]

  let classification_options = await utilities.getClassificationOptions(itemData.classification_id)

  res.render("./inventory/delete-confirmation.ejs", {
    title: title,
    nav,
    classification_options,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Remove Inventory Data
 * ************************** */
invCont.removeVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const removeResult = await invModel.removeInventory(inv_id)

  if (removeResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully removed.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationOptions(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirmation", {
    title: "delete " + itemName,
    nav,
    classification_options: classificationSelect,
    errors: null,
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
  }
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationOptions(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification_options: classificationSelect,
    errors: null,
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
  }
}

module.exports = invCont