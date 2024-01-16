const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const router = require('./router')

const app = express();

app.use((req,res,next)=>{
    res.set("Cache-Control","no-store")
    next();
});
 app.use(express.urlencoded({extended : true}));

 app.use(express.json());

 app.set('view engine', 'ejs');

 app.use(express.static("public"));

 app.use(
    session({
        secret : 'secret',
        resave : false,
        saveUninitialized : true
    })
 )
 app.use('/',router);


app.listen(4000,()=>{
        console.log('Server starts in http://localhost:4000')
});