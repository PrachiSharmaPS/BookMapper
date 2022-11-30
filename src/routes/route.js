const express=require("express")
const router=express.Router()
 
const {createBook,createBook,getbooks,Updatebook,bookbyid,deletebyId}=require("../controllers/bookController")
const {loginData,createUser} = require("../controllers/userController")
const  {Authenticate,Authorization} = require("../middleware/middleware")
const {createReview,updatereview} = require("../controllers/reviewController")

 
router.post("/register",createUser)
router.post("/login",loginData)
router.post("/books",Authenticate,Authorization,createBook)
router.post("/books/:bookId/review",Authenticate,Authorization,createReview)

router.get("/books",Authenticate,getbooks)
router.get("/books/:bookId",Authenticate,bookbyid)

router.put("/books/:bookId",Authenticate,Authorization,Updatebook)
router.put("/books/:bookId/review/:reviewId",Authenticate,Authorization,updatereview)


router.delete("/books/:bookId",Authenticate,Authorization,deletebyId)





router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports=router

