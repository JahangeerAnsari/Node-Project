const express =  require('express');
const {  requiredSignIn } = require('../common-middleware');
const { postForm,savePost,posts } = require('../controller/post.controller');
const router =  express.Router();

router.get('/createPost', requiredSignIn,postForm);
router.post('/createPost', requiredSignIn, savePost);
router.get('/posts/:page', requiredSignIn,posts)
 
  module.exports = router;