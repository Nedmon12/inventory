const express = require('express');
const router = express.Router();
//const upload = multer({dest: "../uploads"})
const userController = require('../controllers/user')
const orderController = require('../controllers/orders')
const categoryController = require('../controllers/category')
const passport = require('passport')
const mysql = require('mysql')

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: process.env.db_user_name,
    password: process.env.db_password,
    database: process.env.db_name
  })

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  const users = []

  users.push({
    id: Date.now().toString(),
    name: 'Admin',
    email: process.env.login_id,
    password: process.env.login_password
  })

  const initializePassport = require('../passport-config')
const e = require('express')
  initializePassport(
    
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )

router.get('/', checkAuthenticated, (req, res) => {
    let sql1 = 'SELECT SUM(Amount) AS TotalItemsOrdered FROM ordersdb';

    let query1= mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
      if(!err1){
      // res.render('index.ejs',{
      //   orders:rows
      // });
      console.log('Fetched total amount from ordersdb')
      total_sales = rows1
      console.log(typeof(rows1))

      let sql2 = 'SELECT COUNT(ItemID) AS NumberOfProducts FROM ordersdb';

      let query2= mysqlConnection.query(sql2, (err2, rows2, fields2)=>{
        if(!err2){
        // res.render('index.ejs',{
        //   orders:rows
        // });
        ord_num = rows2
        console.log('Fetched total no. of orders from ordersdb')

        let sql3 = 'SELECT COUNT(ItemID) AS NumberOfProducts FROM stockdb';

        let query3= mysqlConnection.query(sql3, (err3, rows3, fields3)=>{
        if(!err3){
        // res.render('index.ejs',{
        //   orders:rows
        // });
        console.log('Fetched total no. of stocks from stockdb')
        stock_num = rows3

        let sql4 = 'SELECT SUM(Amount) AS TotalItemsOrdered FROM stockdb';
        let query4= mysqlConnection.query(sql4, (err4, rows4, fields4)=>{
          if(!err3){
            total_stock = rows4
            res.render('index.ejs',{
              total_sales:rows1,
              ord_num:rows2,
              stock_num:rows3,
              total_stock:rows4
              });
          }
          else
          console.log(err4);
       
        });
      }
      else
      console.log(err3);
    });

        }
        else
        console.log(err2);
      });


      }
      else
      console.log(err1);
    });
    // res.render('index.ejs', { name: req.user.name })

   

    
    // console.log(total_sales)
    // console.log(ord_num)
    // console.log(stock_num)
    
  })
router.get("/login" ,checkNotAuthenticated, userController.userLogin)
router.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
router.get('/register', checkNotAuthenticated,userController.userRegistration)
router.post('/register', checkNotAuthenticated,userController.registerUser)

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })


router.get('/orders', checkAuthenticated,orderController.getOrders)
router.get('/viewstocks', checkAuthenticated,orderController.viewStocks)
router.post('/stocks_query',checkAuthenticated,orderController.stocksQuery)
router.post('/fetchitem',checkAuthenticated,orderController.fetchItem)
router.post('/sales_filter_query', checkAuthenticated,orderController.stockFilterQuery)

router.post('/addcategory',checkAuthenticated,categoryController.addCategories)
router.post('/orders_query',checkAuthenticated,categoryController.getCategories)
router.get('/sales_filter', checkAuthenticated,(req, res) => {
    rows = {}
    res.render('sales_filter.ejs',{is_paramater_set : false,time_type: 'none', filter_type: 'none', display_content: rows, month_name: 'None', year:"None", total_amount:"None"})
  })

router.get('/stock_filter', (req, res) => {
    res.render('stock_filter.ejs', {filter_type: 'None',display_content: {}, total_items:{}})
  })
router.get('/stocks', checkAuthenticated,categoryController.getStocks)
router.post('/submitstock', checkAuthenticated,categoryController.submitStocks)
router.post('/deleteitem', checkAuthenticated,categoryController.deleteItem)
router.post('/deletecategory', checkAuthenticated,categoryController.deleteCategory)
router.post('/deletestock', checkAuthenticated,categoryController.deleteStock)

router.get("/postRequest" , (req, res) => {
    //TO DO
})

//router.post('/submitRequest', upload.fields([{name : 'purchaseInterest' },{name :'letterTechCommittee'} , {name : 'letterAward' }, {name : 'approvedPaper'}, {name : 'uniAgreement'}]),purchaseController.submitRequest)




//------------------------------------------
//------------------------------------------
//warehouse employee dashboard and requestForm validation
//router.get("/dashboard", )

//router.get("/requests/:requestId", wareHouseController.formValidate )
//router.get("/requests/handleForm", wareHouseController.handleForm)
//-------------------------------------------
//-------------------------------------------





module.exports = router;