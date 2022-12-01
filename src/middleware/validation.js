const { default: mongoose } = require("mongoose")


const validation =function (req,res,next){

    try {
    
    const bookid = req.params.bookId
    const userid = req.query.userId
    const useriD = req.body.userId

    if(bookid){
        if (!mongoose.isValidObjectId(bookid)){return res.status(400).send({status:false, message:"Please provide valid book ID"})}
    }
    if(userid){
        if (!mongoose.isValidObjectId(userid)){return res.status(400).send({status:false, message:"Please provide valid book ID"})}
    }
    if(useriD){
        if (!mongoose.isValidObjectId(useriD)){return res.status(400).send({status:false, message:"Please provide valid book ID"})}
    }
    next()

    } catch (error) {

        res.status(500).send({status: false, message : error.message})
    }
   
}

module.exports ={validation}