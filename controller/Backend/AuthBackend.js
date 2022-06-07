const User = require("../../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const session = require("express-session")
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

class AuthController {
    getLogin = async(req, res) => {
        res.render('login', { title: 'Login', layout : false });
        
    }
    postLogin = async(req, res) => {
        const { email, password } = req.body
        console.log(req.body);
    
        if (!email || !password)
            return res.status(303).json({ success: false, message: 'Missing email or password' })
        try {
            const user = await User.findOne({ email })
            if (!user)
                return res.status(300).json({ success: false, message: 'Email already exists' })
            const passwordValid = await bcrypt.compare( password ,user.password)
            if (!passwordValid)
                return res.status(300).json({ success: false, message: 'Password already exists' })

            const accessToken = jwt.sign({ user_id: user._id }, process.env.ACCESS_TOKEN)
            localStorage.setItem ('accessToken', accessToken);
            res.redirect('/admin')

        } catch (error) {
            return res.status(500).json({ success: false, message: 'server error' })
        }
    }
}

module.exports = new AuthController()