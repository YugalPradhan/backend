const jwt=require('jsonwebtoken')
const JWT_SECRET="hiiboy182"

const fetchuser=(req,res,next)=>{
//get user from jwt token and add id to req object
const token=req.header('auth-token');
if(!token){
    res.status(401).send({message:"please login first"})
}
try {
    const data=jwt.verify(token,JWT_SECRET);
req.user=data.user;
next();
} catch (error) {
    res.status(401).send({message:"Please login first"})
}
}

module.exports=fetchuser;