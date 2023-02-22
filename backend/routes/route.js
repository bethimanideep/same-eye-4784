const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


require("dotenv").config()
router.use(express.json())
router.post("/users/register", verify, async (req, res) => {
    let data = req.body
    let user = new model(data)
    await user.save()
    res.json("success")
})