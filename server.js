const express = require('express'),
	  bodyParser = require('body-parser'),
	  mongoose 	= require('mongoose'),
	  User 		= require('./models/user.js'),
	  Post		= require('./models/post.js'),
	  Comment 	= require('./models/comment'),
	  session 	= require('express-session'),
	  methodOverride = require('method-override'),
	  multer	= require('multer'),
	  passport	= require('passport'),
	  {ensureAuthenticated} = require('./config/auth');
	  
const user = require('./models/user.js');
const updater = require('./api/updateusername.js');
const { data } = require('jquery');
const post = require('./models/post.js');
const comment = require('./models/comment');
const Friends = require('./models/friends.js');
const freiendreq = require('./models/friendreq.js');

//var upload = multer({ dest: 'uploads/' });



var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './public/images/')
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + '-' + Date.now()+file.originalname);
	}
  })
   
  var upload = multer({ storage: storage })

const app = express();
require('./config/passport')(passport);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/demo",{ useNewUrlParser: true });
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: 'secret',
	hero:'hero',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/', function(req, res){
    res.render('index');//signup page is removed 
})

app.post('/index',function(req,res){
	var username = req.body.username;
	console.log(username);
    var password = req.body.password;
	

	let errors= [];

	if(!username || !password){
		errors.push({msg: 'username or password not provided'});
	}
	if(password.length<4){
		errors.push({msg: 'password should be atleast 4 characters'});
	}
	if(errors.length>0){
			res.render('index',{errors,username,password});
	} else{
			
	
	
	User.findOne({username:username}).then(user => { if(user){
		//user exists
		errors.push({msg: 'username already taken choose another one'});
		res.render('index',{
			errors, username,password
		});
			}else{
				const newUser = new User({
					username,
					password,
					
				});
				
				newUser.save().then(user => {
					
					return res.render('login');
				}).catch(err => console.log(err));
				
			}
})
 
	}
  
    })


app.get('/login',function(req,res){
	res.render('login');
})

app.post('/login',function(req,res,next){
	req.session.username = req.body.username;
	passport.authenticate('local',{
		successRedirect: '/birthday',
		failureRedirect: '/login'
	})(req,res,next);
});

app.get('/logout',(req,res)=>{
	req.session.destroy((err)=>{
		if(err){
			return console.log(err);
		}
		req.logout();
		res.redirect('login');
	})
	
});
 


app.post('/profilepicture', upload.single('avatar'), (req, res, next)=> {
	// req.file is the `avatar` file
	console.log(req.file);
	user.profilepicture = req.file.path;
	console.log(user)
	res.redirect(200,'birthday');
	// req.body will hold the text fields, if there were any
  })


app.get('/birthday',ensureAuthenticated, (req,res)=>{
	User.findById(req.user.id).populate({path:'posts',populate:{path:"comments"},}).exec(function (err, user) {
		if (err) {return handleError(err);}
		res.render('birthday',{
		user: user
	});
});
});

app.get('/feed',ensureAuthenticated,(req,res)=>{
	console.log(req.user.id);
	Post.find().populate({path:"comments"}).exec(function(err,post){ //limit comments to 2 only then add a button show more
		console.log("post form the feed = "+post.comments)
		res.render('feed',{
			user:req.user,
			post:post
		});
	})
	
});



app.get('/notification', ensureAuthenticated,(req,res)=>{
	res.render('notification',{
		user: req.user
	});
})


app.put('/birthday/:id',function(req,res){


	User.findByIdAndUpdate(req.params.id,req.body).then(data=>
		{
			if(!data){
				res.status(404).send({message:"user not found"})
			}else{
				console.log(data);

				res.redirect('/birthday');
			}
		}).catch(err=>{
			res.status(500).send({message:"error update user imformation"});
		})
});



app.put('/birthday/:id/posts', ensureAuthenticated, function(req,res){

	
	User.findById(req.params.id,function(err,user){
		var author = user.username;
		console.log("author of post ="+author);
		if(!user){
			res.status(404).send({message:"user not found"})
		}else{
				var i = 0;
				var content = req.body.posts;
				var likes = 0;
			const post =  new Post({
				i,
				content,
				likes,
				author

			});
			post.save();
			console.log("post content"+post.content);
			user.posts.push(post);
			for (const post of user.posts) {
				console.log("blogpostupper= "+post);//ids are printed 
			}
		
			


			User.findById(req.params.id).populate('posts').exec(function (err, user) {
				if (err) {return console.log(err);}
				for (const post of user.posts) {
					console.log("blogpost= "+post);// blogs in json format printed
													// post.content works prints only content parts;
				}
				console.log('The blog contents are', user.posts);
			  })
			  
	
			
			user.save().then(user => {
				return res.redirect('/birthday');
			}).catch(err => console.log(err));

		}
	})
});




app.get('/profile',ensureAuthenticated,(req,res)=>{
	console.log(user.id);
	res.render('profile',{
		user: req.user});
})


app.post('/birthday/:id/:username',ensureAuthenticated, function (req,res){


	User.findById(req.params.id).populate('posts').exec(function (err, user) {
		if (err) {return handleError(err);}
		else{
		/*for (const post of user.posts) {
			console.log("blogpost= "+post);// blogs in json format printed
											// post.content works prints only content parts;
		}*/
		
		res.render('birthday',{user:user})}

	  });

	
	
})


app.get('/:name',ensureAuthenticated, function (req, res) {
	 var name = req.params.name
	 var id   = '';
	 var oa = req.session.username;
	 var oa_id= '';

	url(name,id,oa,oa_id,res);
			
});

function url(name,id,oa,oa_id,res){
	
	const aaa =  User.findOne({username: name}, function(err,obj) { 
		if(err){
			console.log(err);
		}
		else{
		obj.toObject(); 
		console.log( "obj id= "+obj._id);
		id = obj._id;
		User.findById(id).populate({path:'posts',populate:{path:"comments"},}).exec(function (err, guest) {
			if (err) {return console.log(err);}
			else{
				const op = User.findOne({username:oa},function(err,user){
					if(err){
						console.log(err);
					}
					else{
						user.toObject();
						oa_id = user._id;
						User.findById(oa_id).exec(function(err,host){
							if(err){
								console.log(err)
							}
							else{
								console.log("host= "+host);
								console.log("guest ="+guest);
							    res.render('profile',{
								 host,guest
							  })
						}
						})
						
					}
				})
			
		};//this is wrong ; create a new page and render that page
	
		})

		}

		});
}


//post-----------------------------------

app.post('/api/index/like',ensureAuthenticated, (req,res)=>{
	var id = req.body.id;
	var author = req.session.username;

	
	post.findById(id, (err,post)=>{
		
		if(!post){
			res.status(404).send({message:"post not found"})
		}
		else{
				if(post.likers.length == 0){
					post.likes++;
					post.likers.push(author);
					post.save();
					console.log("1st liker");
					var likes = post.likes;
					return res.json({ data: post.likes, success: true });
				}
				else if(post.likers.length >0)
				{
					for(var i=0;i<post.likers.length;i++){ // need to fix the comment likes similar to this
						if(post.likers[i] == author)
						{
							console.log(post);
							console.log("author already liked this post from api"+ author);
							return res.json({data:post.likes,success:true});
						}
					}
				
						console.log("inside saving new like and author else part");
						console.log("post details form inside else"+post);
						post.likes++;
						console.log("likes updated form api.")
						post.likers.push(author);
						post.save();
						console.log("post details after saving form inside else "+post);
						console.log("post saved from api");
						console.log(post);		
						return res.json({ data: post.likes, success: true });
						
				}	
				
				}
				
				
			}
	);
});

app.put('/api/index/updatepost',ensureAuthenticated,(req,res)=>{
	var id = req.body.postid;
	var author = req.session.username;
	var content = req.body.content;
	console.log("id = "+id+ "author= "+author+ "username ="+author);
	Post.findById(id, (err,post)=>{
		if(!post){
			res.status(404).send({message:"post not found"})
		}
		else{
			if(post.author != author){
				return res.status('404').send({message:"you can not edit the post... you are not the creator of the post"})
			}
			post.content  = content;
			post.save();
			return res.json({ data: {content:post.content, likes:post.likes}, success: true });
		}
	})

});


app.put('/api/index/deletepost',ensureAuthenticated,(req,res)=>{
	var id = req.body.postid;
	var author = req.session.username;
	console.log(id);
	var oa="";
	Post.findById(id,(err,post)=>{
		if(!post){
			res.status(404).send({message:"post not deleted some error from api"});
		}
		else{
			oa = post.author;
			if(oa===author){
				Post.findByIdAndDelete(id,(err,success)=>{
					if(err){
						console.log(err);
						res.status(500).send({message:"something is wrong!"})
					}
					console.log("successfully deleted the post!");
					return res.json({success:true});
				})

			}
			else{
				res.status(404).send({message:"you do not own the post can not delete it"});
			}
		}
	})

	// Post.findByIdAndDelete(id,(err,success)=>{
	// 	if(err){
	// 		console.log(err);
	// 		res.status(404).send({message:"post not deleted some error form api"});
	// 		return res.json({error:true});

	// 	}
	// 	console.log("successflully delelted")
	// 	return res.json({success:true});

	// })
});

//comments--------------------------------

app.post('/api/index/comment',ensureAuthenticated, (req,res)=>{
	
	
	var	blogid = req.body.blogid;
	var content = req.body.content;
	var author = req.session.username;
	var likes =0;
	Post.findById(blogid,(err,post)=>{
		if(!post){
			res.status(404).send({message:"post not found form comment form api"});
		}
		else{
			const comment = new Comment({
				author,
				content,
				likes
			});
			comment.save();
			post.comments.push(comment);
			post.save();

			var commentarr = [];
			Post.findById(blogid).populate('comments').exec(function (err, post) {
				console.log("from inside populate= "+post);
				if (err) {return console.log(err);}
				for (var comment of post.comments) {
					console.log("comments = "+comment);// blogs in json format printed
													// post.content works prints only content parts;
					commentarr.push(comment);
				}
				console.log('The commnet contents are', post.comments);
				console.log(commentarr);
				return res.json({data:content, comments:post.comment, success:true});
			  })

		}
	})
	
});


app.post('/api/index/likedcomment',ensureAuthenticated, (req,res)=>{
	var commentid = req.body.commentid;
	var postid = req.body.postid;
	var author = req.session.username;
	var i =0;
	console.log("likedcomment api")
	Comment.findById(commentid,(err,comment)=>{
		console.log("list of likers = "+comment.likers);
		console.log("likers length= "+comment.likers.length);
		if(!comment){
			res.status(404).send({message:"post not found"})
		}
		else{
			if(comment.likers.length == 0){
				comment.likes++;
				comment.likers.push(author);
				comment.save();
				console.log("1st liker for this comment");
				var likes = comment.likes;
				return res.json({ data: comment.likes, success: true });
			}
			
			else
			{
				for(var j=0;j<comment.likers.length;j++){
						if(comment.likers[j] == author)
						{
							console.log(comment);
							console.log("author already liked this comment from api");
							return res.json({data:comment.likes, success:true});
						}
					}
			}
			
		}
		
	});
});

app.put('/api/index/updatecomment',ensureAuthenticated,(req,res)=>{
	console.log("session data = "+req.session.username);
	var id = req.body.commentid;
	var author = req.session.username;
	var content = req.body.content;
	console.log("id = "+id+ "author= "+author+ "username ="+author);
	Comment.findById(id, (err,comment)=>{
		if(!comment){
			res.status(404).send({message:"comment not found"})
		}
		else{
			if(comment.author != author){
				return res.status('404').send({message:"you can not edit the comment"})
			}
			comment.content  = content;
			comment.save();
			return res.json({ data: {content:comment.content, likes:comment.likes}, success: true });
		}
	})

})

app.put('/api/index/deletecomment',ensureAuthenticated,(req,res)=>{
	var id = req.body.id;
	var author =  req.session.username;
	var oa = "";
	console.log("id from api is= "+id);
			 Comment.findById(id,(err,comment)=>{
				if(err){
					
					console.log(err);
					res.status(404).send({message:" not deleted comment some error form api"});
				}
				else{
					oa = comment.author;
					console.log("origignal poster = "+oa);
					if(oa===author){
						Comment.findByIdAndDelete(id,(err,success)=>{
							if(err){
								console.log(err);
								res.status(404).send({message:"comment not deleted comment some error form api"});
							}
							console.log("successfully deleted comment");
							return res.json({success:true});
						})
					}
					else{
						
					res.status(404).send({message:" not deleted comment some error form api"});
					}
					
				}
				
			})
	
	
	

})
//search-------------------------------------------------------
app.put('/api/index/searchuser',ensureAuthenticated,(req,res)=>{
	var q = req.body.q;
	console.log('search query from api = '+q);
	User.find({username:{$regex:new RegExp('^'+q),$options:'i'}},
	function(err,data){
		if(err){
			console.log(err);
			console.log("error from searchuser get fn");
			res.status(404).send({message:"some error form searchuser api "});
		}
		var users = [];
		
		for(var user of data){
			console.log("id = "+user._id);
			users.push({name:user.username,id:user._id});
		}
		return res.json(users);
	
	})
})

app.get('/api/index/lookforuser',ensureAuthenticated,function(req,res){
	var name = "jim";
	console.log("name for lookup ="+name);
	var id   = '';
	 var oa = req.session.username;
	 console.log("oa form lookup= "+oa);
	 var oa_id= '';
	 url(name,id,oa,oa_id,res);
	
	

	/* 1. search for user using either username or id*/
	/* 2. check if the user is inside the frind list
	   	2.a if user is in friend list show user profile(redirect to /username page )
		2.b if user exits and not in the friendlist  show user profile and add option to add to friend list
		    (redirect to /username page with option to add the user as friend )
	   3.if user not found send an error
	*/

});

//friendreqs--------------------------------------
app.put('/api/index/friendreqsent',ensureAuthenticated,(req,res)=>{
	var guestid = req.body.guestid;
	var author = req.session.username;
	User.findById(guestid,(err,guest)=>{
		if(err){
			console.log(err);
		}
		else{
			
			 for(var request of guest.friendreqs){
				 if(request === author){
					 res.status(200).send({message:"you have already sent the friend req"});
					 return
				 }
			 	
			 }
			
			 guest.friendreqs.push(author);
			 guest.save();
			 console.log(guest);

		}
	})
})

app.listen(3000, console.log("server has started!!"));