const express = require("express");
const router = express.Router();

// middleware that will get called for every request to the router
router.use((req, res, next) => {
    console.log("Time:", Date.now());
    next();
})

router.get("/blog", (req, res) => {
    res.send("get blog router");
})

router.post("/post-blog", (req, res) => {
    res.send("post / create blog router")
})

module.exports = router;