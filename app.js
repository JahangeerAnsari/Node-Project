var express = require('express');

const dotenv = require("dotenv");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash =  require('express-flash');
var app = express();
dotenv.config();
import('./database/index.js');




// add statics files
app.use(express.static("./views"));
// middleware thought we call access data from req.body
app.use(express.urlencoded({ extended: true }));

// store record rakhega
const store = new MongoDBStore({
  uri: process.env.DB_CONNECTION,
  collection:"sessions"  
})
// SESSION
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store:store
}))

//  FLASH MESSAGE MIDDLEWARE
app.use(flash());
app.use((req,res,next) =>{
  // to show the message
  res.locals.message = req.flash();
  next();
})

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page

// ROUTES
const postRoutes =  require('./routes/post.routes')
const profileRoutes = require('./routes/user.profile.routes');
const userRoutes = require('./routes/user.routes');

// 
app.use(postRoutes)
app.use(profileRoutes);
app.use(userRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})