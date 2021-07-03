const express =  require('express');
const { registerValidation,loginValidation, loggeddUser } = require('../common-middleware');
const router =  express.Router();
const { loadSignup,loadSignin,signup ,signin} = require('../controller/user.controller');
router.get('/',loggeddUser, loadSignup);
 router.get('/login', loggeddUser,loadSignin)
  // post request registeration
  router.post('/register',registerValidation,signup );
  router.post('/postLogin',loginValidation, signin);

  module.exports = router;