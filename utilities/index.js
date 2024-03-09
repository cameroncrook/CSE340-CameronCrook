const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="inv-item">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img class="inv-item__photo" src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="inv-item__name-price">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildInvItemView = async function(vehicle) {
  let view
  if (vehicle !== null) {
    view = `
    <section class="item-display">
      <div class="item-display__primary-photo">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model} image">
      </div>
      <ul class="item-display__info-display">
        <li><strong>Price: </strong>${vehicle.inv_price}</li>
        <li><strong>Make: </strong>${vehicle.inv_make}</li>
        <li><strong>Model: </strong>${vehicle.inv_model}</li>
        <li><strong>Year: </strong>${vehicle.inv_year}</li>
        <li><strong>Miles: </strong>${vehicle.inv_miles}</li>
        <li><strong>Color: </strong>${vehicle.inv_color}</li>
        <li><strong>Classification: </strong>${vehicle.inv_classification}</li>
        <li class="item-display__info-display__description">
          <strong>Description: </strong>
          <p>${vehicle.inv_description}</p>
        </li>
      </ul>
      <div class="item-display__call-to-action">
        <button>BUY NOW</button>
      </div>
    </section>
    `
  } else {
    view = '<p class="notice">We appear to have lost this vehicle.</p>'
  }

  return view
}

/* **************************************
* Build the classification options for a select element
* ************************************ */
Util.getClassificationOptions = async function() {
  let classifications = await invModel.getClassifications()

  let classification_options = "";

  classifications.rows.forEach(classification => {
    const option = `
      <option value="${classification.classification_id}">${classification.classification_name}</option>
    `

    classification_options += option
  })

  return classification_options
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util