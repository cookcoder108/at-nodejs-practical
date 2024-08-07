const express = require('express');
const User = require('../models/User');
// const { signup, login, changePassword } = require('../controllers/auth');
const { generateToken, jwtAuthMiddleware } = require('../middleware/Auth');

const router=express.Router();

router.post('/signup',async(req,res)=>{
    try {
        const data= req.body;


        const newUser = new User(data);

        const response= await newUser.save();

        console.log('data saved');

        const payload={
            id:response.id,
            user:response.username,
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload);
        console.log('Token: ',token);

        res.status(200).json({response:response, token:token})
   
    } catch (error) {
        console.log(error,"error while signup");
        return res.status(501).json({
            message:"error while signup"
        }) 
    }
})

router.post('/login', async(req,res)=>{

    try {

        
    const {email,password} =req.body;

    const user=await User.findOne({email:email});
    console.log('User: ',user);
    

    if (!User || !(await user.comparePassword(password))) {
        return res.status(401).json({
            error:"invalid username and password",
        })
    }
    // generate token
    const payload={
        id:user.id,
        user:user.username,
    }

    const token=generateToken(payload);
    res.json({token});
    console.log("Token generatde");
    // console.log(token);
    
    
        
    } catch (error) {
        console.log(err,"error while signup");
        return res.status(501).json({
            message:"error while signup"
        }) 
        
    }

})

router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
    try {
        const userData=req.user;
        console.log('User data: ',userData);

        const userId=userData.id;

        const user=await User.findById(userId);

        res.json({user});
        
        
    } catch (error) {
        console.log(err,"error while signup");
        return res.status(501).json({
            message:"error while signup"
        }) 
    }

})


router.put('/profile/password',jwtAuthMiddleware, async (req,res)=>{
    try {

        const userId=req.user.id;
        console.log('userId: ',userId);
        

        const {currentPassword,newPassword}=req.body;


        const user=await User.findByIdAndUpdate(userId);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({
                error:"invalid username and password",
            })
        }

        user.password=newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message:"password Updated"})
        


        
    } catch (error) {
        console.log(err,"error while signup");
        return res.status(501).json({
            message:"password could not update"
        }) 
    }
})


module.exports=router
