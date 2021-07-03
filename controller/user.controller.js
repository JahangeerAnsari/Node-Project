const User =  require('../models/user');
const bcrypt =  require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt =  require('jsonwebtoken')

exports.loadSignup = (req, res) => {

    title = "Create New Account"
    const errors = []
    res.render('register', { title, errors, inputs: {},login: false });
  };

  exports.loadSignin = (req, res) => {
    title = "Login Account"
    res.render('login', { title ,errors:[], inputs: {}, login: false});
  }

//   signin
exports.signin = async (req,res) =>{
    const errors = validationResult(req);
    const {email,password} = req.body;
    console.log('errors -- ' ,errors.isEmpty(), JSON.stringify(errors))
    if(!errors.isEmpty()){
        console.log("====> no tmepy " , )
        res.render("login",{title:'Login Account',errors:errors.array(), inputs: req.body, login: false})
    }else{
    //    checkEmail Exits
     const checkEmail = await User.findOne({email});
      if(checkEmail != null){
          const id = checkEmail._id;
          const dbPassword = checkEmail.password;
        //   compare both password
        const passwordVerify = await bcrypt.compare(password, dbPassword);
         if(passwordVerify){

            const token = jwt.sign({userId: id},process.env.JWT_SECRET_KEY,{
                expiresIn:'7d'
            });
            console.log("token",token);
            // we have session variable in req (app.js)
            // we can store anything into session
            req.session.user = token;
           res.redirect("/profile");

         }else{
            res.render("login",{title:'Login Account', errors: [{msg:"Wrong Password!"}], inputs: req.body, login: false});
         }

      }else{
        //   show error message on same page
        res.render("login",{title:'Login Account', errors: [{msg:"Email does not exits!"}], inputs: req.body, login: false})
      }
       
    }
   
}

// registeratin  
  exports.signup = async (req, res) => {
  
    const errors = validationResult(req);
    console.log('errors signu p-- ' ,errors.isEmpty(), errors)
    const {name, email, password} =  req.body;
    if (!errors.isEmpty()) {
      //  errors here we stor errors into array
      // errors shown on register page
  
      title = "Create New Account";
      res.render("register", { title, errors: errors.array(), inputs: req.body,login: false})
      // console.log("Errors", errors.array());
    } else {
  
      try {
        // to create the new user and find email alredy exits or not
    const userEmail = await User.findOne({email});
      if(userEmail === null){
      //  create new User
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(password,salt)
  
      const newUser = new User({
        name : name,
        email : email,
       password: hash_password
      })
      try {
      const registerUser =  await newUser.save();
      req.flash('success', 'You have successfully register');
      console.log("register user",registerUser);
        res.redirect("/login");
      } catch (error) {
        console.log(error.message)
      }
      }else{
        res.render("register",{title:'Create new account',
         errors: [{msg:'Email is already exits'}], inputs: req.body, login: false});
      }
       
      } catch (error) {
        console.log(error.message);
      }
    }
  
  
  };
 