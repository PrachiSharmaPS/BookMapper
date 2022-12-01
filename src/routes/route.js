const express=require("express")
const router=express.Router()
 
const {createBook,getbooks,Updatebook,bookbyid,deletebyId}=require("../controllers/bookController")
const {loginData,createUser} = require("../controllers/userController")
const {Authenticate,Authorization} = require("../middleware/middleware")
const {validation} = require("../middleware/validation")
const {createReview,updatereview,deleteReviwsById} = require("../controllers/reviewController")

 
router.post("/register",createUser)
router.post("/login",loginData)
router.post("/books",Authenticate,validation,Authorization,createBook)
router.post("/books/:bookId/review",validation,createReview)

router.get("/books",Authenticate,getbooks)
router.get("/books/:bookId",Authenticate,validation,bookbyid)

router.put("/books/:bookId",Authenticate,validation,Authorization,Updatebook)
router.put("/books/:bookId/review/:reviewId",validation,updatereview)


router.delete("/books/:bookId",Authenticate,validation,Authorization,deletebyId)
router.delete("/books/:bookId/review/:reviewId",validation,deleteReviwsById)//-------need update




router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports=router

