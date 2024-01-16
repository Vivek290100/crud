const mongoose=require("mongoose")
require('dotenv').config();




mongoose.connect('mongodb://127.0.0.1:27017/Vivekdb?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


// mongoose.connect(process.env.MONGOURL,{useNewUrlParser:true,useUnifiedTopology:false})
.then(()=>{
   console.log("connected..........");
})
.catch((err)=>{
   console.log("not connected",err);
})


const users=new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },

})
const collection= new mongoose.model('users',users);
module.exports = collection;