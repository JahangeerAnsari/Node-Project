 const { check } = require('express-validator');
 const jwt = require('jsonwebtoken');

 exports.requiredSignIn = (req,res,next) =>{
    if(req.session.user){
        const token = req.session.user;
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!verifiedToken){
            res.redirect('/login')
        }else{
            // we have 
            req.id = verifiedToken.userId
        }
    }else{
        res.redirect('/login')
    }
    next();
 }

//  if user already Login not show Login / register page
  exports.loggeddUser = (req,res,next) => {
      if(req.session.user){
          const token = req.session.user;
          const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
          if(verifiedToken){
              res.redirect('/profile')
          }
      }
      next();
   }
  
exports.registerValidation = [
    check('name').isLength({ min: 3 }).withMessage("name is required && min length will be 3"),
    check('email').isEmail().withMessage("Valid email is required"),
    check('password').isLength({ min: 6 }).withMessage("Password must be in 6 characters")
  ]
  exports.loginValidation = [
     check('email').isEmail().withMessage("Valid email is required"),
    check('password').isLength({ min: 6 }).withMessage("Password must be in 6 characters")
  ]