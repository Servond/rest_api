const express = require("express");
const router = express.Router();

// middleware that will get called for every request to the router
router.use((req, res, next) => {
    console.log("Time:", Date.now());
    next();
})

router.get("/login", (req, res) => {
    console.log("cookies: ", req.cookies)
    res.send("login router");
})

router.post("/register", (req, res) => {
    res.send("register router");
})

module.exports = router;