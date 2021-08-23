app.post('/api/index/like', (req,res)=>{
	console.log("user id from api is ="+ user.id);
	res.redirect('/birthday');
})
