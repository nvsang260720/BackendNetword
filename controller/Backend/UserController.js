const User = require('../../models/User')

class updateUser {
	getUser = async(req, res) => {
		try {
			const user = await User.find()
			console.log(user)
			res.render('admin/users/listUser', { title: 'Admin', users: user});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}

	}
	getHome = (req, res) => {
		res.render('home', { title: 'Admin'});
	}
	deleteUser = async(req, res) => {
		const userId = req.params.id 
		console.log(userId)
		if(!userId) return res.json("fail id user")
		try {
			
			const deletedUser = await User.findOneAndDelete({_id :userId})
			if (!deletedUser)
				res.redirect('/admin')
			else {
				res.redirect('/admin/get-user')
				
			}	
		} catch (error) {
			console.log(error)
			res.status(500).json({ success: false, message: 'Internal server error' })
		}
	}
	getUpdateUser = async(req, res) => {
		const userId = req.params.id
		try {
			const user = await User.findById(userId)
			console.log(user)
			res.render('admin/users/updateUser', { title: 'Admin', profile: user});
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}

		
	}
	postUpdateUser = async(req, res) => {
		const userId = req.params.id
		try {
			const {avatar, username, about} = req.body
			User.findByIdAndUpdate(userId, {avatar: avatar, username: username, about: about})
			.exec((error, user) => {
				if(error) return res.json({ success: false, message: 'query cart to data fail' })
				if(user){
					console.log(user)
					res.redirect('/admin/user')
				}
			})
			
		} catch (error) {
			res.json({ message: 'get ser fail' })
		}
	}
}


module.exports = new updateUser()