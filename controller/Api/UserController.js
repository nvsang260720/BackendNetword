
const User = require('../../models/User')
const Friends = require('../../models/Friends')
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
    addFriend = async(req, res) => {
        const friendId = req.body.idFriend
        const userId = req.user.user_id
        if (!friendId || !userId)
            return res.status(300).json({ success: false, message: "Missing id user or friends" }) 

        if(friendId === userId)
            return res.status(300).json({ success: false, message: "Must not be duplicated" })

        try {
            const checkOwnerId = await User.findById(userId)
            const checkFriendId = await User.findById(friendId)

            const checkAddOwnerId = await Friends.findOne({ownerid: userId})
            
            if(!checkOwnerId || !checkFriendId)
                return res.status(300).json({ success: false, message: "Account does not exist" }) 
            
            if(!checkAddOwnerId){
                const newFriend = await Friends({
                    ownerid: userId, 
                    friends: [{
                        friend_id: friendId 
                    }] 
                })
                await newFriend.save()
                .then((newFriend) => {
                    console.log(newFriend);
                    User.findByIdAndUpdate( userId, {
                        "$push" : {
                            "friends": newFriend._id
                        }
                    })
                    .exec((error, friend) => {
                        if(error) return res.status(300).json({ success: false, message: error })
                        if(friend){
                            return res.status(200).json({
                                success: true, 
                                message: 'add friend successfully', 
                                friend: friend
                            })
                        }
                    })
                })
                .catch((err) => {
                    res.status(300).json({success: false, message: err });
                });
            }
            const checkAddFriendId = await Friends.findOne({friends: {$elemMatch: { friend_id : friendId}} })
            if(checkAddOwnerId) {
                console.log(checkAddFriendId);
                if(!checkAddFriendId){
                    console.log("hello1");
                    Friends.findOneAndUpdate({ownerid: userId}, {
                        "$push" : {
                                friends: [{
                                    friend_id: friendId 

                                }]
                            }
                    }).exec((error, friend) => {
                        if(error) return res.status(300).json({ success: false, message: error })
                        if(friend){
                            return res.status(200).json({
                                success: true, 
                                message: 'add friend successfully', 
                                friend: friend
                            })
                        }
                    }) 
                }else {
                    return res.status(300).json({ success: false, message: "This account has been friended" }) 
                }
                
            }
            
        } catch (error) {
            
        }
    }
    

}
module.exports = new managerUser()