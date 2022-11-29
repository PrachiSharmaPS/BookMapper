const mongoose=require("mongoose")
const bookModel=require("../models/bookModel");
const userModel = require("../models/userModel");
const moment=require('moment')
//---------------------regex---
const ISBNregex = RegExp("[0-9]{13}");
//const nameregex = RegExp("[a-z]/i");

const createBook=async function(req,res){
try{
    const data=req.body;

    if(Object.keys(data).length == 0){
    return res.status(400).send({status:false, message:"Please provide Data in request"})
    }
    const {userId,title,excerpt,ISBN,category,subcategory}=data
//------------checking all the mandatory fields-------
    if(!userId || !title || !excerpt || !ISBN || !category || !subcategory){
        return res.status(400).send({status:false, message:"Please provide all necessary book Details"})     }

    const bookInfo=await bookModel.findOne({$or:[{title:title},{ISBN:ISBN}]})
     if(bookInfo){
            return res.status(400).send({status:false,message:"title/ISBN is already exists"})
        }
    if (!ISBNregex.test(ISBN)) return res.status(400).send({ status: false, msg: "Please Enter Valid ISBN number" })
   //if (!nameregex.test(title)) return res.status(400).send({ status: false, msg: "Please Enter Valid title" })

    if(!mongoose.isValidObjectId(userId))
    {
        return res.status(400).send({status:false, message:"Please provide valid Object id"})
    }
    const validUser=await userModel.findOne({_id:userId})
    if(!validUser){
        return res.status(400).send({status:false, message:"User not found"})
    }
   
 const bookDetail=await bookModel.create(data)
 bookDetail.releasedAt=moment().format('YYYY MM DD')
    return res.status(201).send({status:true, message:'Success', data:bookDetail})

}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}
//---------------------------get books--------------------------------------------------------------------
const getbooks = async function (req,res){

    try {

    const data = req.query//--------------------------------
        
    const books = await bookModel.find({$and:[data, { isDeleted: false }]}).sort({title:1}).select({_id:1,title:1,excerpt:1, userId:1, category:1, releasedAt:1})

    if (Object.keys(books).length == 0){return res.status(404).send({status:false ,msg: "No such books found"})}

    return res.status(200).send({status:true,msg:"Success",data:books})

    } catch (error) {
        
      return res.status(500).send({msg:error.message})
        
    }
}

module.exports={createBook,getbooks}