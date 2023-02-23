const bcrypt=require("bcrypt")
const path=require('path')
const { model } = require("../configs/db")
const validatoor=async(req,res,next)=>{
    let username = req.body.username
    let pass = req.body.password
    let data = await model.findOne({ username })
    if (data) {
        let h = bcrypt.hashSync(pass, 5)
        if (h) {
            await model.findOneAndUpdate({ username }, { password: h })
            next()
        }
    }
}
module.exports={
    validatoor
}