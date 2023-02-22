const mongoose=require("mongoose")
mongoose.set('strictQuery', false)
require("dotenv").config()
const connection=mongoose.connect(process.env.mongourl)
const schema=mongoose.Schema({
    name:String,
    email:String,
    gender:String,
    password:String,
    age:Number,
    city:String,
    posts:Array
},{
    versionKey:false
})
const model=mongoose.model("user",schema)
module.exports={
    connection,
    model
}