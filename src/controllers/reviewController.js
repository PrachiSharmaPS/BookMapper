//const { json } = require("express");
// const mongoose=require("mongoose")
const bookModel=require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
//const userModel = require("../models/userModel");
const { isValidObjectId } = require('mongoose')

const isValid=function(value){
    if(typeof value==='undefined'|| value=== null)return false
    if(typeof value==='string'&& value.trim().length===0)return false
    if(typeof value==='number'&& value.toString().trim().length=== 0)return false
  }

const createReview = async function (req, res){
try{
    const bookID = req.params.bookId
    const reviewData = req.body
    const {review, rating, reviewedBy} = reviewData
    
    if(Object.keys(reviewData).length == 0){return res.status(400).send({status:false, message:"Please provide Details"})}
    
    if(reviewedBy) {if(reviewedBy.trim().length==0)return res.status(400).send({status:false, msg:"reviewer name can't be empty"}) }

    if(!review ){return res.status(400).send({status:false, message:"Please provide review"})}
    if(!rating){return res.status(400).send({status:false, message:"Please provide rating"})}

    if(isValid(review)){return res.status(400).send({status:false, message:"Please provide valid review"})}
    if(isValid(rating)){return res.status(400).send({status:false, message:"Please provide valid rating"})}
    if(rating<1 || rating>5 ){return res.status(400).send({status:false, message:"please provide valid rting between 1 to 5"})}
  //---------------
    
    let updatedbook= await bookModel.findOneAndUpdate({_id:bookID,isDeleted:false},{$inc:{reviews:+1}},{new:true}).lean()
    if (!updatedbook){return res.status(404).send({status:false, message:"book is deleted or does not exist"})}

    reviewData.bookId = bookID
    let bookreview = await reviewModel.create(reviewData)
 
    // updatedbook = JSON.parse(JSON.stringify(updatedbook))

    updatedbook.bookreviews = bookreview

    return res.status(200).send({status: true,message:"success",data:updatedbook})
}catch(err){
    return res.status(500).send({status:false,msg:err.message})
}
}
//-----------------------------------------------update review -------------------------------------------

const updatereview =async function (req,res){
 try{
    const bookId=req.params.bookId
    const reviewId=req.params.reviewId
    const data=req.body

    const {review,rating,reviewedBy}=data;
 
    if(!isValidObjectId(reviewId)){ return res.status(400).send({statsu:false,msg:"invalid reviewId "})}
    if(Object.keys(data).length == 0) {return res.status(400).send({status:false, message:"Please provide some data"})}

    if(!review &&! rating && !reviewedBy){ return  res.status(400).send({statsu:false,msg:" reviewer details are require "})}

    const filter = {}

    if(review){filter.review = review}
    if(rating){filter.rating = rating}
    if(reviewedBy){filter.reviewedBy = reviewedBy}

   let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
   if (!book) {return res.status(404).send({ status: false, msg: "Book  not found" })}

   let updatedreview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false },{$set:filter},{new:true})
   if (!updatedreview) {
       return res.status(404).send({ status: false, msg: "review  not exists/deleted" })
   }
//    book=JSON.parse(JSON.stringify(book))
   book.bookreviews=updatedreview
 
   return res.status(200).send({status:true,msg:"succes",data:book})
 }
 catch(err){
    return res.status(500).send({status:false,msg:err.message})
}}
//--------------------delete-----------------------
const deleteReviwsById = async function (req, res) {
    try {
        
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

 // --------------------------- finding book and review to be deleted------------------------------


        if (!isValidObjectId(reviewId)) {return res.status(400).send({ status: false, msg: `${reviewId} is not a valid review id` })}

        let book = await bookModel.findById(bookId)
        if (!book || book.isDeleted == true) {return res.status(404).send({ status: false, message: "either Book is not there or book is deleted" })}

        let review = await reviewModel.findById(reviewId)

        if (!review || review.isDeleted == true) {return res.status(404).send({ status: false, message: "Review not found" })}
        if (review.bookId != bookId) {return res.status(400).send({ status: false, message: "Review not found for this book" })}

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true })
        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: "Review deleted successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports ={createReview,updatereview,deleteReviwsById}