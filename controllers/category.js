const mysql = require("mysql")
const bcrypt = require("bcryptjs")
const jwt =  require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config({path:'../.env'})

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: process.env.db_user_name,
    password: process.env.db_password,
    database: process.env.db_name
  })


exports.addCategories = (req,res) => {
    let sql = `INSERT INTO categorydb(Category) VALUES ('${req.body.new}') `
    let query = mysqlConnection.query(sql, (err, rows, fields) => {
      if(!err)
      {
        res.redirect('/categories')
      }
      else
      console.log(err)
  })
}
exports.getCategories = (req,res) => {
    var time_type = req.body['exampleRadios']
    if (time_type == 'month'){
      var month= req.body['selected_month']
      var year = req.body['selected_year']

      const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      var month_name = monthNames[parseInt(month-1)]

      let sql = `SELECT TransactionID,SUM(Amount) as Amount,TransactionDate,TransactionTime FROM ordersdb WHERE TMonth = ${month} AND TYear = ${year} GROUP BY TransactionID`

      let query = mysqlConnection.query(sql, (err, rows, fields)=>{
        if(!err){
          let sql1 = 'SELECT * FROM ordersdb'
          let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
            if(!err1){
              res.render('orders.ejs',{
                orders:rows, sub_orders:rows1, selected_item:'month', month_name:month_name, year:year
              });
             }
             else
              console.log(err1)
          })
         
      }
        else
        console.log(err);
      });
    }

    if (time_type == 'year'){
      
      var year = req.body['selected_year']

      let sql = `SELECT TransactionID,SUM(Amount) as Amount,TransactionDate,TransactionTime FROM ordersdb WHERE TYear = ${year} GROUP BY TransactionID`

      let query = mysqlConnection.query(sql, (err, rows, fields)=>{
        if(!err){
          let sql1 = 'SELECT * FROM ordersdb'
          let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
            if(!err1){
              res.render('orders.ejs',{
                orders:rows, sub_orders:rows1, selected_item:'year', month_name:'None', year:year
              });
             }
             else
              console.log(err1)
          })
         
      }
        else
        console.log(err);
      });
    }
}

exports.getStocks = (req,res) => {
    let sql1 = 'SELECT * FROM categorydb'
    
    let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
      if(!err1)
      {
        var category = rows1
        let sql2 = 'SELECT * FROM branddb'
        let query2 = mysqlConnection.query(sql2, (err2, rows2, fields2)=>{
          if(!err2)
          {
            var brand = rows2
            let sql3 = 'SELECT * FROM sizedb'
            let query3 = mysqlConnection.query(sql3, (err3, rows3, fields3)=>{
              if(!err3)
              {
                var size = rows3
                console.log(typeof(category))
                console.log(category)
                console.log(brand)
                console.log(size)
                res.render('stocks.ejs',{category:category, brand:brand, size:size})
              }
              else
              console.log(err3)
            })
          }
          else
          console.log(err2)
        })
      }
      else
      console.log(err1)

    
  })
}

exports.submitStocks = (req,res) => {
    console.log(req.body)
    var request1 = req.body

    var date_format = new Date();
    var transaction_date = date_format.getDate()+ '/'+ (parseInt(date_format.getMonth()+1)).toString() +'/'+date_format.getFullYear()
    console.log((parseInt(date_format.getMonth()+1)).toString())
    var transaction_time = date_format.getHours() + ':' + date_format.getMinutes() + ':' + date_format.getSeconds()
    let new_req = {};

      for (i in request1){
      if(i.includes("number") || i.includes("total")){
      delete i
      }
      else
      new_req[i] = request1[i]
      }
      
      const data = Object.entries(new_req).reduce((carry, [key, value]) => {
          const [text] = key.split(/\d+/);
          const index = key.substring(text.length) - 1;
          if (!Array.isArray(carry[index])) carry[index] = [];
          carry[index].push(value);
          return carry;
      }, []);

      for (let i = 0; i < data.length; i++) {
        data[i].push(transaction_date);
        data[i].push(transaction_time);
        data[i].push(date_format.getDate())
        data[i].push(date_format.getMonth() + 1)
        data[i].push(date_format.getFullYear())
       }
      

    let sql = `INSERT INTO stockdb(ItemID,ItemName,Category,Brand,Size,Amount,StockDate,StockTime,TDay,TMonth,TYear) VALUES ? `
    let query = mysqlConnection.query(sql,[ data], (err, rows, fields)=>{
      if(!err)
      {
      console.log('Successfully inserted values')
      res.redirect('/viewstocks')
      }
      else
      console.log(err);
    })
}

exports.deleteItem = (req,res) => {
    console.log('deleteitem called')
    var deleteid = req.body.deleteid
    let sql = 'DELETE FROM ordersdb WHERE ItemID = ?'
    let query = mysqlConnection.query(sql,[ deleteid], (err, rows, fields)=>{
      if(!err)
      {
      console.log('Successfully deleted a value')
      res.redirect('/orders')
      
      }
      else
      console.log(err);
    })
}
exports.deleteCategory = (req,res) => {
    console.log('deletecategory called')
    var deleteid = req.body.deleteid
    let sql = 'DELETE FROM categorydb WHERE Category = ?'
    let query = mysqlConnection.query(sql,[ deleteid], (err, rows, fields)=>{
      if(!err)
      {
      console.log('Successfully deleted a category')
      res.redirect('/categories')
      
      }
      else
      console.log(err);
    });
}

exports.deleteStock = (req,res) => {
    console.log('deleteitem called')
    var deleteid = req.body.deleteid
    let sql = 'DELETE FROM stockdb WHERE ItemID = ?'
    let query = mysqlConnection.query(sql,[ deleteid], (err, rows, fields)=>{
      if(!err)
      {
      console.log('Successfully deleted a value')
      res.redirect('/viewstocks')
      
      }
      else
      console.log(err);
    })
}