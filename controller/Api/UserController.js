
const User = require('../../models/User')
const cloudinary =require('../../utils/cloudinary')

class managerUser {
    getAllUser = async(req, res) => {
        try {
            await User.find().exec((error, user) => {
                if(error) return res.status(300).json({ success: false, message: 'get user fail' })
                if(user){
                    res.status(200).json({
                        success: true,
                        message: 'get user successfully',
                        data: user
                    })
                }
            })
        } catch (error) {
            return res.status(500).json({ success: false, message: 'server error' })
        }
    }
    getProfile =  async(req, res) => {
        const userId = req.params.id 
        if(!userId)
            return res.status(300).json({ success: false, message: "missing id user" }) 
        try {
            const checkUser = await User.findById(userId)
            if(!checkUser)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 

            await User.findById(userId)
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
            
        } catch (error) {
            res.json({ success: false, message: 'get profile fail' })
        }
    }
    getUser = async(req, res) => {
        
    }
    setProfile = async(req, res) => {
        const userId = req.params.id 
        if(!userId)
            return res.status(300).json({ success: false, message: "missing id user " }) 
        try {
            const {username, about, address, birthday, gender} = req.body
            const checkUser = await User.findById(userId)
            if(!checkUser)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 
               
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
            
            
        } catch (error) {
            res.json(error)
        }
    }
    uploadAvatar = async(req, res) => {
        const userId = req.user.user_id
        const pathAvatar = req.file
        console.log(userId)

        if(!userId || !pathAvatar)
            return res.status(300).json({ success: false, message: "missing id user or file" }) 
        try {
            const checkUser = await User.findById(userId)
            if(!checkUser)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 

            const result = await cloudinary.uploader.upload(pathAvatar.path, {
                upload_preset: 'upload_avata'
            })
            console.log(result);
            await User.findByIdAndUpdate(userId, { avatar: result.url })
            .exec((error, user) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(user){
                    res.status(200).json({
                        success: true, 
                        message: 'upload avatar successfully', 
                        user: user
                    })
                }
            }) 
        } catch (error) {
            res.status(500).json({success: false, message: error,})
        }
    }
    uploadCover = async(req, res) => {
        const idUser = req.user.user_id
        const pathCover = req.file

        if(!idUser || !pathCover)
            return res.status(300).json({ success: false, message: "missing id user or cover" }) 
        try {
            const checkUser = await User.findById(idUser)
            if(!checkUser)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 

            const result = await cloudinary.uploader.upload(req.file.path, {
                upload_preset: 'upload_avata'
            })
    
            await User.findByIdAndUpdate(idUser ,{cover: result.url})
            .exec((error, user) => {
                if(error) return res.status(300).json({ success: false, message: error })
                if(user){
                    res.status(200).json({
                        success: true, 
                        message: 'set profile successfully', 
                        user: user
                    })
                }
            }) 
            
        } catch (error) {
            res.status(500).json({success: false,message: 'error server',})
        }
    }
    addFollows = async(req, res) => {
        const userID = req.body.userId
        const ownerID= req.user.user_id
        if (!userID || !ownerID)
            return res.status(300).json({ success: false, message: "Missing id owner or user" }) 

        if(ownerID === userID)
            return res.status(300).json({ success: false, message: "Must not be duplicated" })

        try {
            const checkOwnerId = await User.findById(ownerID)
            var listFollowing = checkOwnerId.following

            if(listFollowing.includes(userID) == false){
                await User.findByIdAndUpdate( ownerID, {
                    "$push" : {
                        "following": userID
                    }
                }).exec((error, data) => {
                    if(error) return res.status(300).json({ success: false, message: error })
                    if(data){
                        User.findByIdAndUpdate(userID, {
                            "$push" : {
                                "followers": data._id
                            }
                        }).exec((error, data) => {
                            if(error) return res.status(300).json({ success: false, message: error })
                            if(data){
                                res.status(200).json({
                                    success: true, 
                                    message: 'following user successfully', 
                                })
                            }
                        })
                    }
                })
            }else{
                return res.status(300).json({ success: false, message: "Following this user already exists" }) 
            }
                
        } catch (error) {
             return res.status(500).json({ success: false, message: "error server" }) 
        }
    }
    deleteFollow = async(req, res) => {
        const userID = req.body.userId
        const ownerID= req.user.user_id
        console.log('userid :', userID);
        console.log('ownerid :', ownerID);
        if (!userID || !ownerID)
            return res.status(300).json({ success: false, message: "Missing id owner or user" }) 

        if(ownerID === userID)
            return res.status(300).json({ success: false, message: "Must not be duplicated" })

        try {
            const checkOwnerId = await User.findById(ownerID)
            const checkUserId = await User.findById(userID)
            var listFollowing = checkOwnerId.following

            if(!checkOwnerId || !checkUserId)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 

            if(listFollowing.includes(userID) == true){
                await User.findByIdAndUpdate( ownerID, {
                    '$pull': {
                        'following': userID
                    }
                }).exec((error, data) => {
                    if(error) return res.status(300).json({ success: false, message: error })
                    if(data){
                        User.findByIdAndUpdate(userID, {
                            "$pull" : {
                                "followers": data._id
                            }
                        }).exec((error, data) => {
                            if(error) return res.status(300).json({ success: false, message: error })
                            if(data){
                                res.status(200).json({
                                    success: true, 
                                    message: 'Un Follow user successfully', 
                                })
                            }
                        })
                    }
                })
            }else{
                return res.status(300).json({ success: false, message: "Following this user already exists" }) 
            }
                
        } catch (error) {
             return res.status(500).json({ success: false, message: "error server" }) 
        }
    }
    

}
module.exports = new managerUser()