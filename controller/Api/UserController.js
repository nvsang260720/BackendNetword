
const User = require('../../models/User')
const uploads = require('../../middleware/uploadImages')

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
            const {username, about, address, birthday, gender} = req.body
            console.log(req.body)
            if(userId){
                await User.findByIdAndUpdate(userId, {
                     $set: {
                        username: username,
                        about: about,
                        address: address,
                        birthday: birthday,
                        gender: gender
                     }
                    
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
    uploadAvatar = async(req, res) => {
        const idUser = req.params.id
        const pathAvatar = req.file
        console.log(pathAvatar)
        try {
            if(idUser){
                await User.findOneAndUpdate({ _id: idUser },
                    {
                        $set: {avatar: pathAvatar.filename}
                    }
                ).exec((error, user) => {
                    if(error) return res.json({ success: false, message: error })
                    if(user){
                        res.json({
                            success: true, 
                            message: 'set profile successfully', 
                            user: user
                        })
                    }
                }) 
            }
        } catch (error) {
            res.json({success: false,message: 'error server',})
        }
    }

}
module.exports = new managerUser()