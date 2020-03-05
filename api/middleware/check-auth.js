const jwt= require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        console.log(req.headers.authorization.split(' ')[1],"nikhil gupta");
        const token=req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token,"secret");
        req.userData = decoded;
        next();
    } catch(error){
        console.log(error)
        return res.status(401).json({
            message:'Auth failed'
        });
    }
}