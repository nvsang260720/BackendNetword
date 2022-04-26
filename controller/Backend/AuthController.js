const User = require("../../models/User")
const jwt = require('jsonwebtoken')

const getLogin = (req, res) => {
    res.render('login', { title: 'Login', layout : false });
}
const postLogin = async(req, res) => {
    const email  = req.body.email
    const password  = req.body.password

    if (!email || !password)
        return res.redirect('/admin/login')
    try {
        User.findOne({ email: email})
            .exec((error, user) =>{
                if(error) return res.json({error})
                if(user){
                    console.log(user)
                    if(user.password == password){
                        const accessToken = jwt.sign({ user_id: user.email }, process.env.ACCESS_TOKEN)
                        res
                            .cookie('access_token', accessToken, { maxAge: 900000, httpOnly: true })
                            .redirect('/admin')  
                    }else{
                       res.redirect('/admin/login') 
                    } 
                    
                }
               
            })
    } catch (error) {
        res.redirect('/admin/login')
    }

}
module.exports = {
    getLogin,
    postLogin
}