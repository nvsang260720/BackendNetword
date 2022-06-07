var jwt = require('jsonwebtoken')
var User = require('../models/User')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const checkLogin = async(req, res, next) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        const user = jwt.verify(accessToken,process.env.ACCESS_TOKEN)
        const users = await User.findById(user.user_id) 
        req.user = user;
        localStorage.setItem('url_avatar_user', users.avatar)
        next()
    }else{
        console.log('Is not token');
        res.redirect('/auth/login')
    }
}
module.exports = checkLogin