const path =  require('path')
const multer = require('multer')

var  storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/avatars')
    },
    filename: function(req, file, cb){
        cb(null, req.user.user_id + "-" + file.originalname)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/png" || file.mimetype == "image/jpg"
        ){
            callback(null, true)
        }else{
            console.log('only jpg & pgn file')
            callback(null, false)
        }
    },
    limits: {
        fieldSize: 1024 * 1024 * 4
    }
})
module.exports = upload