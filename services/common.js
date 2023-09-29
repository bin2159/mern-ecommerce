const passport=require('passport')
exports.isAuth=(req,res,next)=> {
    return passport.authenticate('jwt')
  }

exports.sanitizeUser=(user)=>{
    return ({id:user.id,role:user.role})
}

exports.cookieExtrator=function(req){
    let token=null
    if(req&&req.cookies){
      token=req.cookies['jwt']
    }
    return token
  }