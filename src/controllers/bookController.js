const mongoose=require("mongoose")
const bookModel=require("../models/bookModel");
const userModel = require("../models/userModel");


const createBook=async function(req,res){
try{
    const bookData=req.body;

    if(Object.keys(bookData).length == 0){
    return res.Status(400).send({status:false, message:"Please provide book Details"})
    }
    const {userId,title,excerpt,ISBN,category,subcategory}=bookData
//------------checking all the mandatory fields-------
    if(!userId || !title || !excerpt || !ISBN || !category || !subcategory){
        return res.Status(400).send({status:false, message:"Please provide all necessary book Details"})
    }
    const bookInfo=await bookModel.findOne({title:title,ISBN:ISBN})
    {
        if(bookInfo){
            return res.status(400).send({status:false,message:"title/ISBN is already exists"})
        }
    }
    
    if(!mongoose.isValidObjectId(userId))
    {
        return res.Status(400).send({status:false, message:"Please provide valid Object id"})
    }
    const validUser=await userModel.findOne({_id:userId})
    if(!validUser){
        return res.Status(400).send({status:false, message:"User not found"})
    }

    const bookDetail=await bookModel.create(bookData)
    return res.status(201).send({status:true, data:bookDetail})

}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}
//---------------------------get books--------------------------------------------------------------------
const getbooks = async function (req,res){

    try {

    let data = req.query
    let books = await bookModel.find({$and:[data, { isDeleted: false }]}).sort({title:1}).select({_id:1,title:1,excerpt:1, userId:1, category:1, releasedAt:1})

    if (Object.keys(books).length == 0){return res.status(404).send({status:false ,msg: "No such books found"})}

    res.status(200).send({status:true,msg:"Success",data:books})

    } catch (error) {
        
        res.status(500).send({msg:error.message})
        
    }
}

module.exports={createBook,getbooks}