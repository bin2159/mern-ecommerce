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
   token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTUzNDk0NzIxY2FhNGY3OTY5NDUwOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1ODg4NTMyfQ.d3FRuKRxuf0hTLKsPWklOcRjeerZEni2KytzfB_O9wE'
    return token
  }