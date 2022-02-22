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


exports.getOrders = (req,res) => {
    let sql = 'SELECT TransactionID,SUM(Amount) as Amount,TransactionDate,TransactionTime FROM ordersdb GROUP BY TransactionID';

    let query = mysqlConnection.query(sql, (err, rows, fields)=>{
      if(!err){
        let sql1 = 'SELECT * FROM ordersdb'
        let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
          if(!err1){
            res.render('orders.ejs',{
              orders:rows, sub_orders:rows1, selected_item:'None', month_name:'None', year:'None'
            });
           }
           else
            console.log(err1)
        })
       
    }
      else
      console.log(err);
    })
}

exports.viewStocks = (req, res) => {
    let sql = 'SELECT * FROM stockdb ORDER BY TYear DESC,Tmonth DESC, TDay DESC,StockTime DESC';

    let query = mysqlConnection.query(sql, (err, rows, fields)=>{
      if(!err){
        let sql1 = 'SELECT * FROM branddb' 
        let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
          if(!err1){
            let sql2 = 'SELECT * FROM categorydb'
            let query2 = mysqlConnection.query(sql2, (err2, rows2, fields2)=>{
              if(!err2){
                res.render('viewstocks.ejs',{
                  all_stocks:rows, brands:rows1, categories:rows2,  display_content:'None', filter_type:'None', filter_name:'None'
                    });
                }
              else
              console.log(err2)
            })
      
        }
        else
        console.log(err1)
      })
    }
      else
      console.log(err);
    })
}

exports.stocksQuery = (req,res) => {
    let sql = 'SELECT * FROM stockdb ORDER BY TYear DESC,Tmonth DESC, TDay DESC,StockTime DESC';

    let query = mysqlConnection.query(sql, (err, rows, fields)=>{
      if(!err){
        let sql1 = 'SELECT * FROM branddb' 
        let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1)=>{
          if(!err1){
            let sql2 = 'SELECT * FROM categorydb'
            let query2 = mysqlConnection.query(sql2, (err2, rows2, fields2)=>{
              if(!err2){
                var selected_item = req.body['exampleRadios']
                if(selected_item == 'brand'){
                  var brand_name = req.body['selected_brand']
                  let sql3 = `SELECT * FROM stockdb WHERE Brand='${brand_name}'`
                  let query3 = mysqlConnection.query(sql3, (err3, rows3, fields3)=>{
                    if(!err3){
                      res.render('viewstocks.ejs',{
                        all_stocks:rows, brands:rows1, categories:rows2, display_content:rows3, filter_type:'brand', filter_name:brand_name
                          });
                    } 
                    else
                    console.log(err3)
                  })
                }

                if(selected_item == 'category'){
                  var category_name = req.body['selected_category']
                  let sql3 = `SELECT * FROM stockdb WHERE Category='${category_name}'`
                  let query3 = mysqlConnection.query(sql3, (err3, rows3, fields3)=>{
                    if(!err3){
                      res.render('viewstocks.ejs',{
                        all_stocks:rows, brands:rows1, categories:rows2, display_content:rows3, filter_type:'category', filter_name:category_name
                          });
                    } 
                    else
                    console.log(err3)
                  })
                }
              }
              else
              console.log(err2)
            })
      
        }
        else
        console.log(err1)
      })
    }
      else
      console.log(err);
    })

}

exports.fetchItem = (req,res) => {
    item_id = req.body.itemid
    console.log(req.body)

    let sql = 'SELECT * FROM stockdb WHERE ItemID = ?'
    var response = {
      status  : 'success',
      success : 'Updated Successfully'
  }

    let query = mysqlConnection.query(sql, [item_id], (err, rows, fields)=>{
      if(!err)
      {
      console.log(rows)
      // res.render('viewstocks.ejs',{
      //   orders:rows
      // });
      res.json({success : "Updated Successfully", status : 200, rows:rows});
      }
      else
      console.log(err);
    })
}

exports.stockFilterQuery = (req,res) => {
    var filter_type = req.body['exampleRadios1']
    if(filter_type == 'brand'){
      let sql = 'SELECT Brand,count(*) AS Count,SUM(Amount) AS Amount FROM stockdb GROUP BY Brand'
      let query = mysqlConnection.query(sql, (err, rows, fields) => {
        if(!err)
        {
          let sql1 = 'SELECT count(*) AS Count FROM stockdb'
          let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1) => {
            if(!err1)
            {
              res.render('stock_filter.ejs',{filter_type: filter_type,display_content: rows, total_items:rows1}) 
            }
            else
            console.log(err1)
          })
        }
        else
        console.log(err)
      })
    }
    if(filter_type == 'category'){
      let sql = 'SELECT Category,count(*) AS Count,SUM(Amount) AS Amount FROM stockdb GROUP BY Category'
      let query = mysqlConnection.query(sql, (err, rows, fields) => {
        if(!err)
        {
          let sql1 = 'SELECT count(*) AS Count FROM stockdb'
          let query1 = mysqlConnection.query(sql1, (err1, rows1, fields1) => {
            if(!err1)
            {
              res.render('stock_filter.ejs',{filter_type: filter_type,display_content: rows, total_items:rows1}) 
            }
            else
            console.log(err1)
          })
        }
        else
        console.log(err)
      })
    }
}
