const express=require("express")
const noteRouter= express.Router()
const {NoteModel}=require("../models/note.model")
const jwt=require("jsonwebtoken")

/**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         age:
 *           type: integer
 *         userID:
 *           type: string
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: This route is get all the notes from database.
 *     responses:
 *       200:
 *         description: The list of all the notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notes'
 */
noteRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"masai")
    try{
        if(decoded){
            const notes=await NoteModel.find({"userID":decoded.userID})
            res.status(200).send(notes)
        }
    } catch(err){
        res.status(400).send({"msg":err.message}) 
    }
})
/**
 * @swagger
 * /notes/add:
 *  post:
 *      summary: To post a new note to the database
 *      tags: [Notes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Notes'
 *      responses:
 *          200:
 *              description: The note was successfully registered.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Notes'
 *          500:
 *              description: Some server error
 */
noteRouter.post("/add", async(req,res)=>{
    try{
    const note=new NoteModel(req.body)
    await note.save()
    res.status(200).send({"Msz":"A New Note has been added"})
    }catch(err){
        res.status(400).send({"msz":"Wrong Token"})
    }
})
/**
 * @swagger
 * /notes/update:
 *   patch:
 *     summary: To update a notes in the database
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       200:
 *         description: The notes was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *       404:
 *         description: The specified notes ID does not exist.
 *       500:
 *         description: Some server error
 */

noteRouter.patch("/update/:noteID", async (req, res) => {
    let { noteID } = req.params
    let newbody = req.body
    try {
        await NoteModel.findByIdAndUpdate({ _id: noteID }, newbody)
        res.send({ "msg": " Note data updated succesfully" })
    } catch (error) {
        res.send({ "error": "some error occured while updating" })
        console.log(error)
    }
})
/**
 * @swagger
 * /notes/delete:
 *   delete:
 *     summary: To delete a notes from the database
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       200:
 *         description: The notes was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *       404:
 *         description: The specified notes ID does not exist.
 *       500:
 *          description: Some server error
 */
noteRouter.delete("/delete/:noteID", async (req, res) => {
    let  { noteID } = req.params
    try {
        await NoteModel.findByIdAndDelete({ _id: noteID })
        res.send({ "message": "Deleted succesfully" })
    } catch (error) {
        res.send({ "error": "some error occured while deleting" })
    }
})

module.exports={
    noteRouter
}