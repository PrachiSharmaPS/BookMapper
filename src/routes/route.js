const express=require("express")
const router=express.Router()
const aws = require("aws-sdk")
 
const {createBook,getbooks,Updatebook,bookbyid,deletebyId}=require("../controllers/bookController")
const {loginData,createUser} = require("../controllers/userController")
const {Authenticate,Authorization} = require("../middleware/middleware")
const {validation} = require("../middleware/validation")
const {createReview,updatereview,deleteReviwsById} = require("../controllers/reviewController")


router.post("/register",createUser)
router.post("/login",loginData)
router.post("/books",validation,createBook)
router.post("/books/:bookId/review",validation,createReview)//----

router.get("/books",getbooks)
router.get("/books/:bookId",validation,bookbyid)

router.put("/books/:bookId",validation,Updatebook)//----
router.put("/books/:bookId/review/:reviewId",validation,updatereview)


router.delete("/books/:bookId",validation,deletebyId)//-----
router.delete("/books/:bookId/review/:reviewId",validation,deleteReviwsById)



aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     let s3= new aws.S3({apiVersion: '2006-03-01'});
     var uploadParams= {
         ACL: "public-read",
         Bucket: "classroom-training-bucket",
         Key: "abc/" + file.originalname, 
         Body: file.buffer
     }
     
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
         console.log(data)
         console.log("file uploaded succesfully")
         return resolve(data.Location)
     })
    })
 }

 router.post("/write-file-aws", async function(req, res){
    try{
        let files= req.files
        if(files && files.length>0){
            let uploadedFileURL= await uploadFile( files[1])
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    } 
})

router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports=router

