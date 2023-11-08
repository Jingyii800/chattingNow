const router = require('express').Router()

//call method from controller
const {userRegister, userLogin, userLogout} = require('../controller/authController')
const { authMiddleware } = require('../middleware/authMiddleware')

//pass method in the post
router.post('/user-register', userRegister)
router.post('/user-login', userLogin)
router.post('/user-logout', authMiddleware , userLogout)



module.exports = router

