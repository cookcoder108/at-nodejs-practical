const jwt = require('jsonwebtoken');

require('dotenv').config();
exports.jwtAuthMiddleware=(req,res,next)=>{
  const authorization=req.headers.authorization ;
  console.log(authorization);
  
  if(!authorization) return res.status(401).json({error:'token not found'})

    const token=req.headers.authorization.split(' ')[1];
  if(!token) return res.status(401).json({error:'Unauthorized'})

    try {
      const decode= jwt.verify(token,process.env.JWT_SECRET);

      // Attach user infortion 
      req.user=decode;
      next();
      
    } catch (error) {
      console.log(error);
      res.status(401).json({error:'Invalid token'})
      
      
    }
}

exports.generateToken = (userDetails) =>{
  return jwt.sign(userDetails,process.env.JWT_SECRET);
}


