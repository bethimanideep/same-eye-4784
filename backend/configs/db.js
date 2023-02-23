const mongoose=require("mongoose")
mongoose.set('strictQuery', true)
require("dotenv").config()
const connection=mongoose.connect(process.env.mongourl)
const schema=mongoose.Schema({},{
    versionKey:false,
    strict:false
})
const tempschema=mongoose.Schema({},{
    versionKey:false,
    strict:false
})
const model=mongoose.model("user",schema)
const temp=mongoose.model("temp",tempschema)
module.exports={
    connection,
    model,
    temp
}