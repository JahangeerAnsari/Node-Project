const express =  require('express');
const {  requiredSignIn } = require('../common-middleware');
const router =  express.Router();
const { loadProfile,logout} = require('../controller/user.profile.controller');
router.get('/profile', requiredSignIn, loadProfile);
router.get('/logout',logout);


  module.exports = router;