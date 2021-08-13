const isAdmin = (req,res,next)=>{

    if(req.session.user.type == "user")
    {
        res.render("forbidden_page");
        
    }else{
        next();
    }
   
}

module.exports = isAdmin;