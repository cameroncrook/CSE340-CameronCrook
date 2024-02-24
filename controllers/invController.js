const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

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

module.exports = invCont