const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination : function(req,file,callback){
        callback(null,'./public/images/uploads');
    },
    filename : function(req,file,callback){
        const uniquename = uuidv4();
        callback(null,uniquename+path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});
module.exports = upload;