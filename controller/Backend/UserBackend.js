const User = require('../../models/User')
const Posts = require('../../models/Posts')
const Comments = require('../../models/Comments')
const cloudinary =require('../../utils/cloudinary')

class UserController {
	getUser = async(req, res) => {
		const user = req.user.user_id
		try {
			console.log(req.session);
			const user = await User.find()
			res.render('admin/users/listUser', { title: 'Admin', users: user});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}

	}
	getHome = async(req, res) => {
		res.render('admin/home', { title: 'Admin hello'});
	}
	deleteUser = async(req, res) => {
		const userId = req.params.id 
		console.log("userid :",userId);
		if(!userId) return res.json("fail id user")
		try {
			const deletedUser = await User.findOneAndDelete({_id :userId})
			if (!deletedUser)
				res.redirect('/admin')
			else {
				res.redirect('/admin/user')
				
			}	
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: 'Internal server error' })
		}
	}
	getProfile = async(req, res) => {
		const userId = req.params.id

		try {
			var listUrl = [];
			var checkCloud =0;
			await cloudinary.search.expression(userId)
			.sort_by('public_id','desc')
			.max_results(30)
			.execute()
			.then((result) => {
				for (let res of result.resources) {
					listUrl.push(res.url)
				}
			}).catch(err =>{
				checkCloud++
				
			})
			console.log(checkCloud);
			const comment = await Comments.find({userid: userId})
			await User.findById(userId).exec( (error, user) => {
                if(error) return res.redirect('/admin')
                if(user){
					var countFollowers =0;
					var countFollowing =0;
					user.followers.forEach(item => {
						countFollowers++
					});
					user.following.forEach(item => {
						countFollowers++
					});
					Posts.find({_id: {$in : user.posts}}).exec((error, post) => {
						if(error) return res.redirect('/admin')
						if(post && checkCloud ===1 ){
							res.render('admin/users/reviewUser', { 
								title: 'Admin', 
								profile: user, 
								posts: post, 
								following: countFollowing,
								followers: countFollowers,
								urls: '0' ,
								comments: comment
							});	
						}if(post && checkCloud ===0 ){
							res.render('admin/users/reviewUser', { 
								title: 'Admin', 
								profile: user, 
								posts: post, 
								following: countFollowing,
								followers: countFollowers,
								urls: listUrl,
								comments: comment 
							});	
						}
					}) 
                    
                }
            }) 
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
	}
	getUpdateUser = async(req, res) => {
		const userId = req.params.id
		try {
			const user = await User.findById(userId)
			res.render('admin/users/updateUser', { title: 'Admin', profile: user});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}

		
	}
	postUpdateUser = async(req, res) => {
		const userId = req.params.id
		const pathAvatar = req.file
		const {avatar, username, about, address, birthday} = req.body

		try {
			
			const result = await cloudinary.uploader.upload(pathAvatar.path, 
                {
                    upload_preset: 'upload_avata',
                    folder: userId
                },
            )
			User.findByIdAndUpdate(userId, {
				avatar: result.url, 
				username: username, 
				about: about,
				address: address,
				birthday: birthday
			})
			.exec((error, user) => {
				if(error) return res.json({ success: false, message: 'query cart to data fail' })
				if(user){
					console.log(user);
					res.redirect('/admin/user')
				}
			})
			
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
	}
}


module.exports = new UserController()