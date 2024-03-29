const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ************************
 * Get account data to pass to header partial
 ************************** */
Util.getHeaderAccount = function (req, res) {
  if (res.locals.accountData) {
    return res.locals.accountData;
  } else {
    return null;
  }
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
Util.getClassificationOptions = async function(class_id=null) {
  let classifications = await invModel.getClassifications()

  let classification_options = "";

  classifications.rows.forEach(classification => {
    let option = '';
    if (class_id && classification.classification_id == class_id) {
      option = `
      <option value="${classification.classification_id}" selected>${classification.classification_name}</option>
      `
    } else {
      option = `
      <option value="${classification.classification_id}">${classification.classification_name}</option>
    `
    }
    

    classification_options += option
  })

  return classification_options
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

Util.isAdmin = (req, res, next) => {
  if (res.locals.accountData.account_type == 'Admin') {
    next()
  } else {
    req.flash("notice", "Must be an administrator")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check authorization
 * ************************************ */
Util.checkAuth = (req, res, next) => {
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type
    
    if (account_type == 'Employee') {
      next()
    } else {
      req.flash("notice", "You do not have authorization for this page.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "You do not have authorization for this page.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Build Accounts Selection
 * ************************************ */
Util.buildAccountsSelection = async function () {
  const data = await accModel.getAccounts();

  console.log(data);

  let html = `
  <div class="account-data">
    <strong>First Name</strong>
    <strong>Last name</strong>
    <strong>Email</strong>
  </div>
  `;
  data.forEach(account => {
    html += `
    <div class="account-data">
      <p>${account.account_firstname}</p>
      <p>${account.account_lastname}</p>
      <p>${account.account_email}</p>
      <div class="account-data__options">
        <button>delete</button>
        <select>
          <option ${account.account_type === 'Client' ? 'selected' : ''}>Client</option>
          <option ${account.account_type === 'Employee' ? 'selected' : ''}>Employee</option>
          <option ${account.account_type === 'Admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
    </div>
    `
  })

  return html
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util