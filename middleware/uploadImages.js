const path =  require('path')
const multer = require('multer')

var  storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, req.user.user_id + "-" + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        if( file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
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