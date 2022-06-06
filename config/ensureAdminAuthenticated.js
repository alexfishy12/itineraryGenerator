module.exports = (req,res,next)=>{
    if(req.isAuthenticated()){

        if(req.user.rank === "Admin"){
            return next();
        }else{
            res.status(401);
            res.send("Must be logged as an admin to access content");
        }
    }
    res.redirect("/login");
};