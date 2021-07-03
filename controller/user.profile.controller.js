const User = require('../models/user')

exports.loadProfile = async (req, res) => {
    // req.id comes from verified token
  const id = req.id;
//now access the user 
  const user = await User.findOne({_id : id})
    title = "User Profile Page";
    const errors = []

    res.render("profile", { title, errors, login: true,user })
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.redirect('/login');
        }
    })
}

