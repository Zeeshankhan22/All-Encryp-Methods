const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
require("dotenv").config();

// const encrypt=require('mongoose-encryption')                                                                  //1. Method
// const md5=require('md5')                                                                                      //2. Method
const bcrypt = require("bcryptjs");                                                                              //3. Method



const app=express()
app.use(express.static('data'))
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine", "ejs")

//Database
mongoose.connect('mongodb://127.0.0.1:27017/secretdb')
const secretscheme = mongoose.Schema({
  email: String,
  password: String,
});


//Mongoose Encryption  - Method 1 of Encryption                                                                                                                                     
                                                                                                                                                                                                                                                        
// const SECRET="This is my secret"                                                                                     
// secretscheme.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})                         //Part 1  - Mix Password into my Secret Hash
const User = mongoose.model("User", secretscheme);


///////////////////////////////////////////// Routes /////////////////////////////////////////////
//Main Route
app.route('/')
.get((req,res)=>{
    res.render('home')
})


//Register Route                                                                                                                                          
app.route("/register").get((req, res) => {
  res.render("register");
})
.post((req,res)=>{

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {

      const User1 = new User({
        email: req.body.mail,
        password: hash,
      });
      User1.save().then(() => res.render("secrets")) .catch((err)=>console.log(err))

    })})


    // const User1 = new User({
    //   email: req.body.mail,
    //   password: md5(req.body.password),                                                                           //PArt2: md5 to Encrpt Password when Register 
    // })
    // User1.save()
    // .then(()=>res.render("secrets"))
    // .catch((err)=>console.log(err))

})


//Login Route
app.route("/login").get((req, res) => {
  res.render("login");
})
.post((req,res)=>{

    const usermail = req.body.useremail;
    // const userpass = md5(req.body.userpassword);                                                                 //PArt2: md5 to Decrpyt when Login
    const userpass = req.body.userpassword;                                                                 

    User.findOne({email:usermail})
    .then((data)=>{
        // if(data.password===userpass){
        //     res.render("secrets");
        // }
        bcrypt.compare(userpass, data.password, (err, result)=> {
           if(result===true){
            res.render("secrets");
        }
        });

    }).catch((err)=>console.log(err))



})





//Listen Route
app.listen(3000,()=>console.log('Server Run on 3000 Port'))