const User = require('../models/user.js');


module.exports.renderSignupForm = (req,res)=>{
    res.render('users/signup.ejs')
}

module.exports.signup = async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to Wanderlust!');
            res.redirect('/listings');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup')
    }
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render('users/login.ejs')
}


module.exports.login =  (req,res)=>{
    req.flash('success','Welcome to back Wanderlust!'); 
    let redirectUrl =   res.locals.redirectUrl || '/listings';//in direct login from navebar then islogged in not call and hence the res.locals.redirectUrl ==  null and it show page not found.
    res.redirect(redirectUrl)
}


module.exports.logout =  (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','You are logout'); 
        res.redirect('/listings')

    });
}