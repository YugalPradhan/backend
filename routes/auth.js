const express=require('express')
const router=express.Router();
const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {body,validationResult}=require('express-validator');
const JWT_SECRET="hiiboy182"
const fetchuser=require('../middleware/fetchuser')

router.post('/createuser',[
    body('name','Enter a valid name'),
    body('password','Password must be atleast 5 charachters').isLength({min:5}),
    body('email','Enter valid email').isEmail()
]
,async(req,res)=>{
    try{
        let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
         return res.status(400).json({success,errors:errors.array()});
    }
    let user=await User.findOne({email:req.body.email})
    if(user)
    return res.status(400).json({success,error:"email already exists"});
    
    const salt= await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    user=await User.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email
    })
    const data={
        user:{
            id:user.id
        }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    success=true;
    return res.json({success,authToken})
}catch(error){
    return res.status(500).json({success:false,error:error.message});
}})

//for login
router.post('/login',[
    body('password','Password cannot be empty').exists(),
    body('email','Enter valid email').isEmail()
]
,async(req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()})
    }
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error:"Invalid credentials"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"Invalid credentials"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
        return res.json({success,authToken})
    }catch(error){
       return res.status(500).json({success,error:error.message});
    }
})

//route3 get user details
router.get('/getuser',fetchuser,async(req,res)=>{
    try{let success=false;
let userId=req.user.id;
const user=await User.findById(userId).select("-password")
    success=true;
    return res.json({success,user});
    }catch(error){
       return res.status(500).json({success,error:error.message})
    }
})
module.exports=router;