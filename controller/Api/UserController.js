const User = require('../../models/User')

class managerUser {
    getProfile =  async(req, res) => {
        const userId = req.params.id 
        try {
            if(userId){
               await User
                .findById(userId)
                .exec((error, user) => {
                    if(error) return res.json({ success: false, message: 'query cart to data fail' })
                    if(user){
                        res
                        .json({
                            success: true,
                            message: 'get profile successfully',
                            data: user
                        })
                    }
                }) 
            }
            
        } catch (error) {
            res.json({ success: false, message: 'get profile fail' })
        }
    }
    setProfile = async(req, res) => {
        const userId = req.params.id 
        const {username, about, address, birthday, avatar, cover} = req.body
        console.log("cai cc")
        
    }

}
module.exports = new managerUser()