const mongoose=require("mongoose")
const bookModel=require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel")
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

//----------------------------------------Getbooksbyid-----------------------------------------

const bookbyid = async function(req,res){

try {
    
    const bookid = req.params.bookId

   // if(Object.keys(bookid).length == 0) {return res.status(400).send({status:false, message:"Please provide bookid in parems"})}

    if (!mongoose.isValidObjectId(bookid)){return res.status(400).send({status:false, message:"bookID is invalid"})}

    let data = await bookModel.findOne({_id: bookid},{isDeleted:false})

    if (!data){return res.status(400).send({status:false, message:"Book not found"})}

    const bookreviews = await reviewModel.find({bookId: bookid},{isDeleted:false}).select({isDeleted:0})
    
  data=  JSON.parse(JSON.stringify(data))
 
  data.bookreviews=bookreviews


    return res.status(200).send({status:true,message:"Success",data:data})
    
} catch (error) {
    return res.status(500).send({status:false,msg: error.message})
    
} 
} 

//-------------------------------------------update by Id --------------------------------------------

const Updatebook = async function (req,res){

try {

    const bookid = req.params.bookId

    if (!mongoose.isValidObjectId(bookid)){return res.status(400).send({status:false, message:"bookID is invalid"})}

    const bodydata = req.body

   // if(Object.keys(bodydata).length == 0) {return res.status(400).send({status:false, message:"Please provide book in body"})}

    const {title,excerpt,releaseAt,ISBN} = bodydata

    const Obj = {}
    if (title) {Obj.title =  title}
    if (excerpt) {Obj.excerpt = excerpt}
    if (releaseAt) {Obj.releaseAt = releaseAt}
    if (ISBN) {Obj.ISBN = ISBN}

    if(Object.keys(Obj).length == 0) {return res.status(400).send({status:false, message:"Please provide unique constraints"})}

    const unique = await bookModel.findOne({Obj})

    if (!unique){return res.status(400).send({status:false, message:"plz provide unique details"})}

    const updatedata = await bookModel.findOneAndUpdate({_id:bookid,isDeleted:false},{$set:Obj},{new:true})

    return res.status(200).send({status: true,message:"success",data:updatedata})

} catch (error) {

    return res.status(500).send({status:false,msg:error.message})   
}
}

//------------------------------------------------delete by Id --------------------------------------------


const deletebyId = async function(req,res){

    const bookid  = req.params.bookId

    if (!mongoose.isValidObjectId(bookid)){return res.status(400).send({status:false, message:"Please provide valid book ID"})}

    const data = await bookModel.findOne({_id:bookid,isDeleted:false})

    if(!data) {return res.status(400).send({status:false, message:"book does not exist or deleted"})}

    const deletedata = await bookModel.findOneAndUpdate({_id:bookid,isDeleted:false},{$set:{isDeleted:true}},{new:true})

    return res.status(200).send({status: true,message:"success",data:deletedata})

}


module.exports={createBook,getbooks,bookbyid,Updatebook,deletebyId}