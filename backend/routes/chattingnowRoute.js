const router = require('express').Router()

const {getFriends, messageUploadDB, messageGet, imageUpload,messageSeen, messageDelivered} = require('../controller/chattingnowController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/get-friends', authMiddleware, getFriends)
router.post('/send-message', authMiddleware, messageUploadDB)
router.get('/get-message/:id', authMiddleware, messageGet)
router.post('/send-image', authMiddleware, imageUpload)
router.post('/seen-message', authMiddleware, messageSeen)
router.post('/delivered-message', authMiddleware, messageDelivered)
module.exports = router

