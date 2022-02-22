const mysql = require("mysql")
const bcrypt = require("bcryptjs")
const jwt =  require("jsonwebtoken")
const dotenv = require('dotenv')
//const multer = require('multer')
dotenv.config({path:'../.env'})

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: process.env.db_user_name,
    password: process.env.db_password,
    database: process.env.db_name
  })


exports.userLogin = (req,res) => {
    res.render('login.ejs')
}

exports.userRegistration = (req,res) => {
    res.render('register.ejs')
}
exports.registerUser = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        })
        console.log(users)
        res.redirect('/login')
      } catch {
        res.redirect('/register')
      }
}

exports.getEmployees = (req,res) => {

}

