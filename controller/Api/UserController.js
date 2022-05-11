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
        try {
            const {username, about, address, birthday, avatar, cover} = req.body
            if(userId){
                await User.findByIdAndUpdate(userId, {
                    username: username,
                    about: about,
                    address: address,
                    birthday: birthday,
                    avatar: avatar,
                    cover: cover
                }).exec((error, user) => {
                    if(error) return res.json({ success: false, message: 'set profile fail' })
                    if(user){
                        res
                        .json({
                            success: true,
                            message: 'set profile successfully',
                        })
                    }
                }) 
            }
            
        } catch (error) {
            res.json(error)
        }
    }

}
module.exports = new managerUser()