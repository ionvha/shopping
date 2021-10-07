const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const path = require('path')
const artTemplate = require('art-template'); 
const express_template = require('express-art-template'); 
const app = express();

// 配置模板引擎
app.set('views', __dirname + '/views/');
app.engine('html', express_template);
app.set('view engine', 'html')

// 允许跨域
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*')
    next();
})

const config = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "shopping"
}
const connection = mysql.createConnection(config);
connection.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('connect mysql success')
})

// 渲染购物车页面
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/index.html'))
})

// 获取后台数据
app.get('/index',(req,res)=>{
    let sql = `select * from productlist`
    connection.query(sql,(err,result) => {
        res.json(result)
    })
})

// 修改数量
app.get('/amount',(req,res)=>{
    let {id,amount,state} = req.query;
    if(state === '0'){
        amount--
    }else {
        amount++
    }  
    let sql = `update productlist set amount = ${amount} where id = ${id}`
    connection.query(sql,(err,result)=>{
        if(result.affectedRows){
            console.log('成功')
        }else {
            console.log(err);
        }
    })
})

app.get('/delete',(req,res) => {
    let {id} = req.query;
    let sql = `delete from productlist where id = ${id}`
    connection.query(sql,(err,result) => {
        if(result.affectedRows){
            console.log('成功')
        }else {
            console.log('失败')
        }
    })
})

app.listen(4000,()=>{
    console.log('连接成功')
})
