const express = require("express")
const path = require("path")
const passport = require("passport")
const bcrypt = require("bcrypt")
const session = require("express-session")
const app = express()
const cors = require("cors")
const { connection, temp, model } = require("./configs/db")
const { validatoor } = require("./middleware/validator")
var cloudinary = require('cloudinary');
const fileUpload = require("express-fileupload")
const { router } = require("./uploadimage")
//file uploading
app.use(fileUpload({
    useTempFiles: true
}))

app.use(cors())
require("./auth")
app.use(express.json())
app.use(express.static(path.join(__dirname, "client")))
app.use("",router)
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}
//cloudinary
cloudinary.config({
    cloud_name: 'dhiinmiwr',
    api_key: '471387892837728',
    api_secret: '-BTZRpmZJzj32KGnE159YcNRXB8'
});



app.get('/', (req, res) => {
    res.send("Welcome backend")
})

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));


app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session())
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
    })
);


app.get("/auth/google/failure", (req, res) => {
    res.send("went wrong")
})
app.get("/auth/protected", isLoggedIn, async (req, res) => {
    let name = req.user
    let data = {
        username: req.user.displayName,
        email: req.user.email,
        image: req.user.picture,
        type: "google",
        importedimages: []
    }
    if (name) {
        let user = await model.findOne({ email: data.email })
        if (user == null) {
            let dbuser = new model(data)
            await dbuser.save()
            let tempuser = new temp(data)
            await temp.deleteMany()
            await tempuser.save()
            res.redirect("http://127.0.0.1:5501/frontend/temp.html")
        } else {
            await temp.deleteMany()
            let tempuser = new temp(data)
            await tempuser.save()
            res.redirect("http://127.0.0.1:5501/frontend/temp.html")
        }
    }
})
app.get("/auth/logout", isLoggedIn, (req, res) => {
    req.session.destroy()
    res.send("bye")
})
app.get("/tempuser", async (req, res) => {
    let user = await temp.find()
    if (user.length === 0) {
        res.json("false")
    } else {
        res.json(user[0])
    }
})
app.post("/adduser", async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let user = await model.findOne({ email })
    if (user) {
        res.json("exists")
    } else {
        let hash = bcrypt.hashSync(password, 5)
        req.body.password = hash
        let user = new model(req.body)
        await user.save()
        res.json("success");
    }
})
app.post("/loginuser", async (req, res) => {
    let email = req.body.email
    let user = await model.findOne({ email })
    if (user) {
        await temp.deleteMany()
        res.json(user)
    } else {
        res.json("notexists")
    }
})
app.post("/verify", async (req, res) => {
    let email = req.body.email
    let user = await model.findOne({ email })
    if (user) {
        res.json("matched")
    } else {
        res.json("notmatched")
    }
})
app.patch("/resetpassword", validatoor, async (req, res) => {
    res.json("success")
})
app.get("/admin", async (req, res) => {
    let users = await model.find()
    res.json(users)
})
app.delete("/delete", async (req, res) => {
    let id = req.body.id
    await model.findByIdAndDelete({ _id: id })
    let newdata = await model.find()
    res.json(newdata)
})
app.patch("/updating", async (req, res) => {
    let id = req.body.id
    let val = req.body.value
    let user = await model.findOne({ _id: id })
    if (user) {
        await model.findByIdAndUpdate({ _id: id }, { username: val })
        let newdata = await model.find()
        res.json(newdata)
    } else {
        res.json("error")
    }
})
app.listen(5000, async () => {
    try {
        await connection
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
    console.log("running at 5000");
})