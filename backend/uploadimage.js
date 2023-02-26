const express = require("express")
const router=express.Router()
const path=require("path");
const { model } = require("./configs/db");
var cloudinary = require('cloudinary').v2;
router.use(express.json())
cloudinary.config({
    cloud_name: 'dhiinmiwr',
    api_key: '471387892837728',
    api_secret: '-BTZRpmZJzj32KGnE159YcNRXB8'
});
let arr=[]
router.post('/postimage',(req,res)=>{
    const file=req.body.file
    console.log(file);
    // cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    //     console.log(result);
    // })
    res.json(file)
})
router.get("/displaypage",(req,res)=>{
        res.sendFile((__dirname)+"/import.html")
})
router.post("/postid",(req,res)=>{
    arr.push(req.body.email)
    res.send()
})
router.post("/imgbb",async(req,res)=>{
    let img=req.body.image
    console.log(arr);
    let user=await model.findOne({email:arr[0]})
    if(user){
        user.importedimages.push(req.body.image)
    }
    let up=await model.findOneAndUpdate({email:arr[0]},{importedimages:user.importedimages})
    await up.save()
    res.json()
})
router.get("/getimages",async(req,res)=>{
    console.log(arr);
    let user=await model.findOne({email:arr[0]})
    if(user){
        res.json(user.importedimages)
    }
})
router.get("/cleararr",async(req,res)=>{
    arr=[]
    console.log(arr);
    res.json()    
})
router.post("/deleteimages",async(req,res)=>{
    let index=req.body.index
    let user=await model.findOne({email:arr[0]})
    if(user){
        let a=user.importedimages
        let up=[]
        for(i=0;i<a.length;i++){
            if(index!=i){
                up.push(a[i])
            }
        }
        console.log(up,user,a);
        await model.findOneAndUpdate({email:arr[0]},{importedimages:up})
        res.json(up)
    }
})
router.post("/accountdelete",async(req,res)=>{
    let email=req.body.email
    let user=await model.findOne({email:email})
    console.log(user,email);
    if(user){
        await model.findOneAndDelete({email})
        res.json("success")
    }else{
        res.json("Invalid Credentials")
    }
})


module.exports={
    router,
    arr
}