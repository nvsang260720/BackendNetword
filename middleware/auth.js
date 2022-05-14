const jwt = require('jsonwebtoken')

// const verifyToken = (req, res, next) =>{
//     const authHeader = req.header('Authorization')
//     const token = authHeader && authHeader.split(' ')[1]
//     if(!token) return res.sendStatus(401)
//     try {
//         const access_token = localStorage.getItem("access_token")
        
//         const user = jwt.verify(token,access_token)
//         console.log(access_token)
//         req.user = user;
//         next()
//     } catch (error) {
//         return res.status(500).json({ success: false,  message: 'Token Fail' })
        
//     }
// }
const generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}

module.exports = {
    verifyToken,
    generateToken
}