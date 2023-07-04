const express = require("express")
const cookieParser = require("cookie-parser")
const PORT = 8000;

const { authRouter, blogRouter } = require("./routers")

const app = express();
app.use(express.json());

// third party middleware
app.use(cookieParser());

// middleware that will get called for every request to the app
app.use((req, res,next) => {
    console.log("Time1:", Date.now());
    next();
})

// using router in different file
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);


// route path to root
app.get("/", (req, res) => {
    //example of cookies
    console.log("Cookies: ", req.cookies)
    res.send("root")
})

// json response 
app.get("/json-example", (req, res) => {
    res.status(500).json({ message: "ini json response" })
})
// http://localhost:8000/blogs/15
app.get("/blogs/:blogId", (req, res) => {
    res.send("get blogs")
})

app.post("/blogs", (req, res) => {
    res.send("post blogs")
})

app.put("/blogs", (req, res) => {
    res.send("put blog")
})

// http://localhost:8000/users/15/blogs/1
app.get("/users/:userId/blogs/:blogId", (req, res) => {
    res.send("something")
})

// route path to about
app.get("/about", (req, res) => {
    res.send("about")
})

// route path to random.text
app.get("/random.text", (req, res) => {
    res.send("random.text")
})

// route path to acd and abcd (optional)
app.get("/ab?cd", (req, res) => {
    res.send("ab?cd");
})

// route path to abcd, abbcd, abbbcd, and so on
app.get("/ab+cd", (req, res) => {
    res.send("ab+cd")
})

// route path to abcd, abxcd, abANYTHINGcd, ab123cd, and so on
app.get("/ab*cd", (req, res) => {
    res.send("ab*cd")
})

// route path to abe and abcde
app.get("/ab(cd)?e", (req, res) => {
    res.send("ab(cd)?e");
})

// route path to anything that ends with a fly, butterfly, dragonfly
app.get(/.*fly/, (req, res) => {
    res.send("/*fly")
})

const object = {
    username: "iniUser1",
    email: "iniEmailUser@1.com"
}

// route parameter
app.get("/users/:userId/blogs/:blogId", (req, res) => {
    const { userId, blogId } = req.params;
    res.send(`userId: ${userId}, blogId: ${blogId}`);
})

// route query
// http://localhost:8000/query-example/?page=15&size=10
app.get("/query-example", (req, res) => {
    const { page = 1, size } = req.query;
    console.log(page, size)
    res.send(`page: ${page}, size: ${size}`)
} )

app.get("/sequence-middleware", (req, res, next) => {
    console.log(1);
    next();
}, (req,res, next) => {
    console.log(2);
    next();
}, (req, res, next) => {
    console.log(3);
    next();
}, (req, res) => {
    console.log(4)
    res.send("finally done")
})

// redirect examples

app.get("/redirects", (req, res, next) => {
    const { data } = req.query;
    if (data !== "true") {
        res.redirect("/redirect-catcher")
    } else {
        next();
    }
}, (req, res) => {
    res.send("tidak diredirect")
})

app.get("/redirect-catcher", (req, res) => {
    res.send("masuk ke redirect")
})

// more than one callback
app.get(
    "/double-callback", 
    (req, res, next) => {
        const { roles } = req.body;
        if (roles !== "admin") {
            throw new Error(500, "UnAuthorized login")
        } else { 
            next();
        }
    },
    (req, res, next) => {
        console.log("this is middleware 2")
        next();
    }, (req, res) => {
    res.send("Hello this is callback b")
})

// middleware error handler

app.get("/try-error2", (req, res, next) => {
    try {
        const error = new Error("ada yang salah!")
        error.code = 500;
        throw error;
    } catch (err) {
        // will use middleware error handler
        console.log(err);
        next(err);
    }
})

app.get("/try-error", (req, res, next) => {
    try {
        if (error == 1) {
            res.status(500).send("")
        } else {

        }
    } catch (err) {
        // will not use middleware error handler instead return response
        // with status code
        res.status(404).send(err.message)
    }
})

// middleware error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.code).send(err.message)
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})