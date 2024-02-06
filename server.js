const express = require("express");
const app = express();
const client=require("mongodb").MongoClient;
let dbinstance;
client.connect("mongodb://localhost:27017",{}).then((data)=>{
    console.log("Database connected");
 dbinstance= data.db("Registration")

}).catch((err)=>{
    console.log("Error in database");


});

const cookieparser=require("cookie-parser");
const session=require("express-session");
const path =require("path");
app.use(express.static("."));
app.use(express.urlencoded());
app.use(cookieparser());
const oneday=60*60*24*1000;

app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:'sdfs@#$df4%121',
    cookie:{maxAge:oneday}


}))
app.set("view engine", "ejs");
app.get("/signup",(req,res)=>{
    res.render("sign");
})

app.post("/signup", async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        
        const existingUser = await dbinstance.collection("Signup").findOne({ email: user.email });

        if (existingUser) {
            
            return res.render("exist", { error: "User with this email already exists" });
        }

        
        const result = await dbinstance.collection("Signup").insertOne(user);
        console.log(`Inserted ${result.insertedCount} record into the collection`);

        
        res.render("dashboard");
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(3000,(err)=>{
    if(!err){
        console.log("Connection is ok");
    }
})





