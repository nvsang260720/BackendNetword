const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require('../../models/User')


const logout = (req, res) => {
    try {
        if (req.cookies.access_token)
            return res
            .clearCookie("access_token")
            .status(200)
            .json({ success: true, message: 'Logout Successful' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error Server' });
    }

}
const login = async(req, res) => {
    const { email, password } = req.body

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

        res.status(200).json({
                success: true,
                message: 'login successfully',
                token: accessToken,
                data: user
            })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'server error' })
    }
}

const register = async(req, res) => {

    const { username, email, password } = req.body
    if (!email || !password)
        return res.status(303).json({ success: false, message: 'Missing email or password' })
    try {
        const user = await User.findOne({ email })
        if (user)
            return res.status(300).json({ success: false, message: 'Email already exists' })

        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hasPassword })
        await newUser.save()

        const accessToken = jwt.sign({ user_id: newUser._id }, process.env.ACCESS_TOKEN)
        res.cookie('access_token', accessToken, { maxAge: 900000, httpOnly: true })
            .status(200).json({
                success: true,
                message: 'Created successfully',
                token: accessToken,
                data: newUser
            })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}
module.exports = {
    register,
    login,
    logout
}