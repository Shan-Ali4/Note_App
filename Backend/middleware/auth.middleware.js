const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
       try{
           // Extract token from "Bearer <token>" format or use token directly
           const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token
           const decoded = jwt.verify(actualToken,'masai')
           console.log(decoded)
           req.body.userID=decoded.userID
           next()
       }catch(err){
           console.log("Token verification error:", err.message)
           res.status(400).send({"Msz":"Invalid or expired token"})
       }
    }else{
        res.status(400).send({"msz":"Didn't Login"})
    }
}

module.exports={
    auth
}