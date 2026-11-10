const jwt = require("jsonwebtoken")


module.exports.authMiddleware = async(req,res,next) => {
    const {customerToken} = req.cookies

    if(!customerToken) {
        res.status(409).json({error : " لطفا ابتدا وارد شوید🙅‍♂️"})
    }else{
        try {
            const deCodeToken = await jwt.verify(customerToken , process.env.SECRET)
            req.role = deCodeToken.role
            req.id = deCodeToken.id
            next()
        } catch (error) {
            res.status(409).json({error : "لطفا ابتدا وارد شوید 🙅‍♂️"})
        }
    }

}