const express=require("express")
const router=express.Router()
 
const bookController=require("../controllers/bookController")
const userController=require("../controllers/userController")
const middleware = require("../middleware/middleware")
 
router.post("/register",userController.createUser)
router.post("/login",userController.loginData)
router.post("/books",middleware.Authenticate,middleware.Authorization,bookController.createBook)
router.get("/books",middleware.Authenticate,bookController.getbooks)
router.get("/books/:bookId",middleware.Authenticate,bookController.bookbyid)
router.put("/books/:bookId",middleware.Authenticate,middleware.Authorization,bookController.Updatebook)
router.delete("/books/:bookId",middleware.Authenticate,middleware.Authorization,bookController.deletebyId)




router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports=router

