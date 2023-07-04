let express = require("express");
const cors=require("cors");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin","*");
res.header(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
var port=process.env.port || 2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));
app.use(cors(
));
let {empCookiesData}=require("./empCookiesData.js");
// console.log(empCookiesData);
const cookieParser=require("cookie-parser");

app.use(cookieParser("abcjdeiwk-12345567"));

app.post("/login",function(req,res){
    let code=req.signedCookies.code;
    let {name,empCode}=req.body;
    console.log(req.body);
    let user=empCookiesData.find(k=>k.name===name && k.empCode===+empCode);
    console.log(user);
    if(user){
        if(!code){
            res.cookie("code",empCode,{ httpOnly: true, sameSite: 'None', secure: true, });
            res.send("Login Successful");
        }
        else{
            res.send("Login Successful");
        }
    }else{
        res.status(404).send("Login failed");
    }
    
});
app.get("/logout",function(req,res){
    res.clearCookie("empCode");
    res.send("Logout successfully");
});
app.get("/myDetails",function(req,res){
     let code=req.cookies.code;
     console.log(code);
     if(code){
     let emp=empCookiesData.find(k=>k.empCode===+code);
     if(emp){
        res.send(emp);
     }
     else{
        res.status(404).send("Not Found");
     }
     }
     else{
        res.status(401).send("Forbidden");
     }
});
app.get("/company",function(req,res){
    let code=req.cookies.code;
    if(code){
        res.send(`Welcome to the Employee Portal of XYZ Company`);
    }
    else{
        res.status(403).send("First Logged in")
    }
});

app.get("/myJuniors",function(req,res){
    let code=req.cookies.code;
    if(code){
        let emp=empCookiesData.find(k=>k.empCode===+code);
        console.log(emp);
        if(emp){
            if(emp.designation==="VP"){
                let juniors=empCookiesData.filter(k=>k.designation==="Trainee" || k.designation==="Manager");
                res.send(juniors);
            }
            else if(emp.designation==="Manager"){
                let juniors=empCookiesData.filter(k=>k.designation==="Trainee");
                res.send(juniors);
            }
            else{
                res.send("There is no junior");
            }
            
        }
        else{
            res.status(403).send("Please login first");
        }
    }
});
