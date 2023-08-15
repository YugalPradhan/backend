const express=require('express')
const router=express.Router();
const fetchuser=require('../middleware/fetchuser')
const Notes=require('../models/Notes');
const {body,validationResult}=require('express-validator');
const { route } = require('./auth');

router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Notes.find({user:req.user.id});
       return res.json(notes)
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
  
})

router.post('/addnote',fetchuser,[
    body('title',"title can't be empty").exists()
],async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
    }

    const note=new Notes({
    title,description,tag,user:req.user.id
    })
    const savenote=await note.save();
    return res.json(savenote)
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
})

//route 3 update note
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try{
    const {title,description,tag}=req.body;
    var newNote={};
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag};
    let note=await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("operation not allowed")
    }
    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    return  res.json({note});}
    catch(error){
       return res.status(500).json({message:error.message})
    }
   // const note=Notes.findByIdAndUpdate()
})

//route 4 delete note
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try{
    const {title,description,tag}=req.body;
    let note=await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("operation not allowed")
    }
    note=await Notes.findByIdAndDelete(req.params.id)
    return res.json("note has been deleted")}
    catch(error){
       return res.status(500).json({message:error.message})
    }
   // const note=Notes.findByIdAndUpdate()
})
module.exports=router;