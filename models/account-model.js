const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email, exclude_id=null){
    try {
      if (exclude_id) {
        const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2"
        const email = await pool.query(sql, [account_email, account_id])
        return email.rowCount
      } else {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
      }
    } catch (error) {
      return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Update Account
* ***************************** */
async function updateAccount (account_firstname, account_lastname, account_email, account_id) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *',
      [account_firstname, account_lastname, account_email, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error(`Error while updating account: ${error}`)
  }
}

async function updatePassword (account_password, account_id) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *',
      [account_password, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return new Error(`Error while updating password: ${error}`)
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, updatePassword}
