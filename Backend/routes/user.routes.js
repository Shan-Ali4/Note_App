const express = require("express")
const userRouter = express.Router()
const { UserModel } = require('../models/user.model')
const jwt = require("jsonwebtoken")
const bcrypt=require("bcrypt")

/**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         location:
 *           type: string
 *         age:
 *           type: integer
 */


// Register page
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Registration has been done
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msz:
 *                   type: string
 *                   description: Registration message
 *                   example: Registration has been done!
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msz:
 *                   type: string
 *                   description: Error message
 *                   example: There Is Err
 *                 err:
 *                   type: object
 *                   description: Error object
 *                   example: {}
 */
userRouter.post("/register", async (req, res) => {
    const { email, password, location, age } = req.body;
    
    // Validate all required fields
    if (!email || !password || !location || !age) {
      return res.status(400).json({ 
        msz: "All fields required: email, password, location, age" 
      });
    }

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msz: "User already exists with this email" });
      }
      const hash = await bcrypt.hash(password, 5);
      const user = new UserModel({ email, password: hash, location, age });
      await user.save();
      console.log("User registered:", user);
      res.status(200).json({ msz: "Registration has been done!" });
    } catch (err) {
      console.log("Registration error:", err.message);
      res.status(500).json({ msz: "Error during registration", err: err.message });
    }
  });

// Login Page
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Login message
 *                   example: Login successfull!
 *                 token:
 *                   type: string
 *                   description: JSON Web Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1YzBkNDg1NzA1ODA5NjJjNDkw
 *       400:
 *         description: Wrong credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                   example: Wrong Credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                   example: There Is Err
 *                 err:
 *                   type: object
 *                   description: Error object
 *                   example: {}
 */

userRouter.post("/login",async(req,res)=>{
  const {email,password}=req.body
  
  if(!email || !password){
    return res.status(400).send({"msg":"Email and password required"})
  }
  
  try{
      const user=await UserModel.findOne({email})
      if(!user){
          return res.status(400).send({"msg":"User not found"})
      }
      
      bcrypt.compare(password,user.password, async (err, result) => {
          if(err){
              console.log("Bcrypt compare error:", err)
              return res.status(400).send({"msg":"Error comparing password"})
          }
          
            if(result === true){
              const secret = process.env.JWT_SECRET || 'masai'
              const token = jwt.sign({"userID":user._id}, secret)
              res.status(200).send({"msg":"Login successfull!","token":token, "userID": user._id})
          } else {
              console.log("Password mismatch for user:", email)
              res.status(400).send({"msg":"Wrong Credentials"})
          }
      });
  }catch(err){
      console.log("Login error:", err.message)
      res.status(400).send({"msg":"Login error"})
  }
})

module.exports = {
    userRouter
}