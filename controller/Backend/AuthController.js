const User = require("../../models/User")
const jwt = require('jsonwebtoken')
const argan2 = require('argon2')

const getLogin = (req, res) => {
    res.render('login', { title: 'Login', layout : false });
}
const postLogin = async(req, res) => {
    const {email, password}  = req.body
    

    if (email == "" || password == "")
        return res.redirect('/admin/login')

    try {
        console.log(email)
        User.findOne({ email: email})
            .exec(async(error, user) =>{
                if(error) return res.json({error})
                if(user){
                    console.log(user)
                    const passwordValid = await argan2.verify(user.password, password)
                    if(passwordValid){
                        console.log("login oke")
                        const accessToken = jwt.sign({ user_id: user.email }, process.env.ACCESS_TOKEN)
                        res
                            .cookie('access_token', accessToken, { maxAge: 900000, httpOnly: true })
                            .redirect('/admin')  
                    }else{
                        console.log("fail pass")
                        res.redirect('/admin/login') 
                    } 
                    
                }
                
            }) 
    } catch (error) {
        console.log("server fail")
        res.redirect('/admin/login') 
    }
  
       

   


}
module.exports = {
    getLogin,
    postLogin
}