const mongoose=require("mongoose")
const bookModel=require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel")
const moment=require('moment')
//-------------------------------------------------
const isValid=function(value){
    if(typeof value==='undefined'|| value=== null)return false
    if(typeof value==='string'&& value.trim().length===0)return false
    if(typeof value==='number'&& value.toString().trim().length=== 0)return false
    return true
  }
//---------------------regex-------------------
const ISBNregex = RegExp("[0-9-]{13}");

const createBook=async function(req,res){
try{
    const data=req.body;

    if(Object.keys(data).length == 0){return res.status(400).send({status:false, message:"Please provide Data in request"})}

    const {userId,title,excerpt,ISBN,category,subcategory}=data
//------------checking all the mandatory fields-------
if(!isValid(title)){
    return res.status(400).send({status:false, message:"title is required"})     }
//--------------------------------------------
    if(!userId ){
        return res.status(400).send({status:false, message:"Please provide userId "})     }
    if(!ISBN ){
            return res.status(400).send({status:false, message:"Please provide ISBN "})     }    
            if (!ISBNregex.test(ISBN)) return res.status(400).send({ status: false, msg: "Please Enter Valid ISBN number" })
    if(!isValid(excerpt)){
                return res.status(400).send({status:false, message:"excerpt is required"})     }
    if(!isValid(category) ){
        return res.status(400).send({status:false, message:"category is required"})     }
    if(!isValid(subcategory)){
        return res.status(400).send({status:false, message:"subcategory is required "})     }

    if (!mongoose.isValidObjectId(userId)){return res.status(400).send({status:false, message:"Please provide valid book ID"})}

    const validUser=await userModel.findOne({_id:userId})
    if(!validUser){return res.status(400).send({status:false, message:"User not found"})}

    const bookInfo=await bookModel.findOne({$or:[{title:title},{ISBN:ISBN}]})
    if(bookInfo){return res.status(400).send({status:false,message:"title/ISBN is already exists"})}
  
    const bookDetail=await bookModel.create(data)

    bookDetail.releasedAt=moment().format('YYYY MM DD')

    return res.status(201).send({status:true, message:'Success', data:bookDetail})
}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}

//---------------------------get books--------------------------------------------------------------------
 const getbooks = async function(req,res){
        try{
             const data = req.query;
             const{userId,category,subcategory} = data
             const filterData = {isDeleted:false}
            if (Object.keys(data).length == 0) {
                let getAllBooks = await bookModel.find(filterData).sort({ title: 1 }).select({_id:1, title:1, excerpt:1, userId:1, category:1, subcategory:1, releasedAt:1, reviews:1})
                return res.status(200).send({ status: true, message: 'Books list', data: getAllBooks })
            }
            if (userId) {
                if (!mongoose.isValidObjectId(userId)) {
                    return res.status(400).send({ status: false, message: "Enter valid user id" })
                }
                 filterData.userId = userId
            }
            if (category) {
                filterData.category = category
            }
            if (subcategory) {
                filterData.subcategory = subcategory
            }
            if (Object.keys(filterData).length == 1) {return res.status(400).send({ status: false, message: "you can't find data with that key" })} 
                    
            let findBooks = await bookModel.find(filterData).sort({ title: 1 }).select({_id:1, title:1, excerpt:1, userId:1, category:1, subcategory:1, releasedAt:1, reviews:1})
            if (findBooks.length == 0) {
                return res.status(404).send({ status: false, message: "No data found" })
            }
                return res.status(200).send({ status: true, message: 'Books list', data: findBooks })
     }
        catch(err){ return res.status(500).send({status:false, message : err.message})
        }
    }

//----------------------------------------Getbooksbyid-----------------------------------------

const bookbyid = async function(req,res){

try {
    
    const bookid = req.params.bookId

    let data = await bookModel.findById(bookid).lean()

    if (!data){return res.status(404).send({status:false, message:"Book not found"})}
    if (data.isDeleted===true){return res.status(404).send({status:false, message:"Book is deleted"})}

    const bookreviews = await reviewModel.find({bookId: bookid},{isDeleted:false}).select({isDeleted:0})

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
    const bodydata = req.body
    const {title,excerpt,releasedAt,ISBN} = bodydata

    if(ISBN){if (!ISBNregex.test(ISBN)) return res.status(400).send({ status: false, msg: "Please Enter Valid ISBN number" })}

    const Obj = {}
    if (title) {Obj.title =  title}
    if (ISBN) {Obj.ISBN = ISBN}
    if (releasedAt) {Obj.releasedAt =  releasedAt}
    if (excerpt) {Obj.excerpt = excerpt}

    const uniqueFeilds={}
    if (title) {Obj.title =  title}
    if (ISBN) {Obj.ISBN = ISBN}

    if(Object.keys(Obj).length === 0) {return res.status(400).send({status:false, message:"Please provide unique constraints"})}

    //--db call for unique ----   
    if(Object.keys(uniqueFeilds).length != 0){
    const unique = await bookModel.findOne({uniqueFeilds})
    if (unique){return res.status(400).send({status:false, message:"plz provide unique details"})}}

    const updatedata = await bookModel.findOneAndUpdate({_id:bookid,isDeleted:false},{$set:Obj},{new:true})

    return res.status(200).send({status: true,message:"success",data:updatedata})

} catch (error) {

    return res.status(500).send({status:false,msg:error.message})   
}
}

//------------------------------------------------delete by Id --------------------------------------------

const deletebyId = async function(req,res){

    const bookid  = req.params.bookId
  
    const deletedata = await bookModel.findOneAndUpdate({_id:bookid,isDeleted:false},{$set:{isDeleted:true}},{new:true})//-------
    if(!deletedata) {return res.status(404).send({status:false, message:"book does not exist or deleted"})}
    
    await reviewModel.updateMany({bookId:bookid},{$set:{isDeleted:true}})

    return res.status(200).send({status: true,message:"success"})

}


module.exports={createBook,getbooks,bookbyid,Updatebook,deletebyId}