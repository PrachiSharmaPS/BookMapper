const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const bookModel = require("../models/bookModel")



const Authenticate = function(req,res,next){
    try {

    const token = req.headers["x-auth-token"]

    if (!token)return res.status(400).send({ Status: false, message: "plz provide token"})

     let Decodedtoken = jwt.verify(token,"Book-Project",(err, decode) => {if (err) {let msg = err.message === "jwt expired"? "Token is expired": "Token is invalid"
            return msg 
          }
          req.decodedtoken = decode
          return false
        })
        if (Decodedtoken) return res.status(400).send({ Status: false, message: Decodedtoken})

    next()

    } catch (error) {
        res.status(500).send({status: false,message : error.message})
    } 
}

const Authorization = async function(req,res,next){

    const bookId = req.params.bookId
    const userId = req.body.userId 

    const tokenid = req.decodedtoken.UserId

    if (userId){
        if (userId != tokenid){ return res.status(403).send({status:false, msg:"you are not allowed to perform this action"})}
        return next()
    }

    if (bookId){

        if(!isValidObjectId(req.params.bookId)){res.send("no")}
        
        const bookid = await bookModel.findOne({_id:bookId})

        if (!bookid){ return res.status(400).send({status:false, msg:"ID not present"})}

        if (bookid.userId != tokenid){ return res.status(403).send({status:false, msg:"you are not allowed to perform this action"})}

        next()
    }
}





module.exports = {Authenticate,Authorization}