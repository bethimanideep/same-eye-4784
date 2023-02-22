const express=require("express")
const { connection } = require("./configs/db")
const app=express()
const {router}=require("./routes/route")
require("dotenv").config()
const cors=require("cors")
app.use(cors())
app.use(express.json())
app.use("/app",router)
app.get("/",(req,res)=>{
    res.json({"msg":"welcome user"})
})
app.listen(process.env.port,async(req,res)=>{
    try {
        await connection
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
    console.log(`server running ${process.env.port}`);
})
