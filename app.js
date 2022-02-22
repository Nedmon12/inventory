const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')

app.use(bodyparser.json());

  var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: process.env.db_user_name,
    password: process.env.db_password,
    database: process.env.db_name
  });
  
  mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection succeeded')
    else
    console.log('DB connection failed \n Error :' + JSON.stringify(err,undefined,2));
  })

  const users = []

    users.push({
      id: Date.now().toString(),
      name: 'Admin',
      email: process.env.login_id,
      password: process.env.login_password
    })
  

const initializePassport = require('./passport-config')
const e = require('express')
  initializePassport(
    
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )


app.use( express.static( "public" ) )
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))

app.use ('/', require('./routes/pages'))



app.listen(4000, ()=>{
    console.log("Server has started on port 4000");
})