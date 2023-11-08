const jwt = require('jsonwebtoken')

module.exports.authMiddleware = async(req, res, next) => {
    const {authToken} = req.cookies
    if (authToken){
        const deCodeToken = await jwt.verify(authToken, process.env.SECRET)
        //get user id
        req.myId = deCodeToken.id
        //pass it to next function
        next()
    }else{
        res.status(400).json({
            error:{
                errorMessage: "Please Login"
            }
        })
    }
} 