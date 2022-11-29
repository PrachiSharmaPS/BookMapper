const express=require("express")
const router=express.Router()
 
const bookController=require("../controllers/bookController")
const userController=require("../controllers/userController")
 
router.post("/register",userController.createUser)
router.post("/login",userController.loginData)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getbooks)



router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports=router

