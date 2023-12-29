var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')
const passport = require('passport');
const upload = require('./multer');
const localStratergy = require('passport-local');
passport.use(new localStratergy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login',{error : req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload',isLoggedIn,upload.single('file'),async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({username : req.session.passport.user});
  const post = await postModel.create({
    imageText : req.body.filecaption,
    image : req.file.filename,
    user : user._id
  });
  user.posts.push(post._id);
  user.save();
  res.redirect('/profile');
});

router.get('/profile',isLoggedIn, async function(req,res,next){
  var user = await userModel.findOne({
    username : req.session.passport.user
  }).populate('posts');
  res.render('profile',{user}); 
})

router.post('/register',function(req,res,next){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })
  })
})

router.post('/login',passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}),function(req,res){
});

router.get('/logout',function(req,res){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}



/*
router.get('/createUser',async function(req,res,next){
  let createdUser = await userModel.create({
    username : "Abhishek",
    password : "abhi@123",
    posts :[],
    email : "abhi@gmail.com",
    fullName : "Abhishek Naresh Khairnar"
  })
  res.send(createdUser)
})

router.get('/getAllUserPosts',async function(req,res,next){
  let user = await userModel.findOne({_id : "65894f234570b3de71adb86b"}).populate('posts');
  res.send(user);
})

router.get('/createPost', async function(req,res,next){
  let createdPost = await postModel.create({
    postText : "Hello this is new post",
    user : "65894f234570b3de71adb86b"
  })
  let user = await userModel.findOne({_id : "65894f234570b3de71adb86b"})
  user.posts.push(createdPost._id);
  await user.save();
  res.send("done!");
})
*/




module.exports = router;
