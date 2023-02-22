const express = require("express")
const path = require("path")
const passport = require("passport")
const session = require("express-session")
const app = express()
const cors=require("cors")
app.use(cors())
require("./auth")
app.use(express.json())
app.use(express.static(path.join(__dirname, "client")))

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
    // res.sendFile((__dirname)+'/index.html');
    res.send("dlkjl")
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
app.get("/auth/protected", isLoggedIn, (req, res) => {
    let name=req.user
    res.send(`Hello ${JSON.stringify(name)}`)
})
app.get("/auth/logout", isLoggedIn, (req, res) => {
    req.session.destroy()
    res.send("bye")
})
app.listen(5000, () => {
    console.log("running at 5000");
})