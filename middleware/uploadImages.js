const path =  require('path')
const multer = require('multer')

var  storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/avatars')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ){
            callback(null, true)
        }else{
            console.log('only jpg & pgn file')
            callback(null, false)
        }
    },
    limits: {
        fieldSize: 1024 * 1024 * 2
    }
})
module.exports = upload