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
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({ email, password: hash, location, age });
        await user.save();
        console.log(user);
        res.status(200).send({ msz: "Registration has been done!" });
      });
    } catch (err) {
      res.status(500).send({ msz: "There Is Err", err });
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
  try{
      const user=await UserModel.findOne({email})
      if(user){
          bcrypt.compare(password,user.password, (err, result) => {
              if(result){
                  res.status(200).send({"msg":"Login successfull!","token":jwt.sign({"userID":user._id},"masai")})
              } else {
                  res.status(400).send({"msg":"Wrong Credentials"})
              }
          });
      }
  }catch(err){
      res.status(400).send({"msg":err.message})
  }
})

module.exports = {
    userRouter
}