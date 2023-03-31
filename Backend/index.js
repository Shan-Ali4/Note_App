const express=require("express")
const {connection}=require('./db')
const {userRouter}=require('./routes/user.routes')
const {noteRouter}=require('./routes/note.routes')
const {auth}=require("./middleware/auth.middleware")
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUI=require("swagger-ui-express")
const cors=require("cors")
const app=express()
require("dotenv").config()

app.use(express.json())
app.use(cors())

//definition
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Learning Swagger",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:4500"
            }
        ]
    },
    apis:["./routes/*.js"]
}

//specification
const swaggerSpec= swaggerJSdoc(options)
//building UI
app.use("/documentation/notes",swaggerUI.serve,swaggerUI.setup(swaggerSpec))
app.use("/documentation/users",swaggerUI.serve,swaggerUI.setup(swaggerSpec))



app.use("/route",userRouter)
app.use(auth)
app.use("/notes",noteRouter)
app.listen(process.env.port,async ()=>{
    try{
        await connection
        console.log("Connected With DB")
    }catch(err){
        console.log(err)
    }
    console.log(`Server is running at port ${process.env.port}`)
})