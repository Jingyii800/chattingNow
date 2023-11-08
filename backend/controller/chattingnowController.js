const user = require('../models/authModel')
const messageModel = require('../models/messageModel')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

const getLastMsg = async(myId, fdId) => {
    const msg = await messageModel.findOne({
        $or: [{
            $and:[{
                senderId :{
                    $eq: myId
                }
            }, {
                recevierId: {
                    $eq: fdId
                }
            }]
        }, {
            $and: [{
                senderId: {
                    $eq: fdId
                }
            }, {
                recevierId:{
                    $eq: myId
                }
            }]
        }]
    }).sort({
        updatedAt: -1
    })
    return msg
}

module.exports.getFriends = async (req, res) =>{
    const myId = req.myId
    let fnd_msg = []
    try{
        const getFriend = await user.find({
            _id: {
                $ne: myId
            }
        })
        //for loop to get last message for each friend and combine info into one object
        for (let i = 0; i < getFriend.length; i++){
            let lmsg = await getLastMsg(myId, getFriend[i].id)
            fnd_msg = [...fnd_msg, {
                fndInfo: getFriend[i],
                msgInfo: lmsg
            }]
        }
        // const filter = getFriend.filter(d=> d.id !== myId)
        res.status(200).json({
            success: true,
            friends: fnd_msg
        })

    }catch (error){
        res.status(500).json({
            error:{
                errorMessage: "Internal Server Error"
            }
        })
    }
}

module.exports.messageUploadDB = async(req, res)=> {
    const senderId = req.myId
    const {recevierId, message, senderName} = req.body
    try{
        const insertMessage = await messageModel.create({
            senderId: senderId,
            recevierId: recevierId,
            senderName: senderName,
            message: {
                text: message,
                image: ''
            }
        })
        res.status(201).json({
            success: true,
            message: insertMessage
        })
    }catch (error){
        res.status(500).json({
            error:{
                errorMessage: 'Internal Server Error'
            }
        })
    }
}

module.exports.messageGet = async(req, res) => {
    const cur_friendId = req.params.id
    const my_id = req.myId
    try{
        let getAllMessage = (await messageModel.find({

            $or: [{
                $and: [{
                    senderId: {
                        $eq: my_id
                    }
                }, {
                    recevierId : {
                        $eq: cur_friendId
                    }
                }]
            }, {
                $and : [{
                    senderId:{
                        $eq: cur_friendId
                    }
                },{
                    recevierId: {
                        $eq: my_id
                    }
                }]
            }]

        }))
        // .filter(m => m.senderId===my_id && m.recevierId=== cur_friendId 
        //     || m.recevierId === my_id && m.senderId === cur_friendId)
        
        res.status(200).json({
            success: true,
            message: getAllMessage
        })
    }catch (error){
        res.status(500).json({
            error:{
                errorMessage: "Internal Server Error"
            }
        })
    }

}

module.exports.messageSeen = async(req, res) => {
    const messageId = req.body._id
    await messageModel.findByIdAndUpdate(messageId, {
        status: 'seen'
    }).then(()=>{
        res.status(200).json({
            success: true,
        })
    }).catch(()=> {
        res.status(500).json({
            error:{
                errorMessage: 'Internal Server Error'
            }
        })
    })
}

module.exports.messageDelivered = async(req, res)=> {
    const messageId = req.body._id
    await messageModel.findByIdAndUpdate(messageId, {
        status: 'delivered'
    }).then(()=> {
        res.status(200).json({
            success: true
        })
    }).catch(()=>{
        res.status(500).json({
            error: {
                errorMessage: "Internal Server Error"
            }
        })
    })
}

module.exports.imageUpload = (req, res) =>{

    const form = new formidable.IncomingForm()
    const senderId = req.myId

    form.parse(req, (err, fields, files) => {
        const {imageName, recevierId, senderName} = fields
        const newPath = path.join(__dirname, '../../frontend/public/image', imageName[0])
        files.image[0].originalFilename = imageName[0]

        try {
            fs.copyFile(files.image[0].filepath, newPath, async(error)=> {
                if (error) {
                    res.status(500).json({
                        error: {
                            errorMessage : "Image Upload fail"
                        }
                    })
                } else {
                    const insertMessage = await messageModel.create({
                        senderId : senderId,
                        recevierId: recevierId[0],
                        senderName: senderName[0],
                        message: {
                            text: '',
                            image: files.image[0].originalFilename,
                        }
                    })
                    res.status(201).json({
                        success: true,
                        message: insertMessage
                    })
                }
            })

        }catch (error) {
            res.status(500).json({
                error :{
                    errorMessage: "Internal Server Message"
                }
            })
        }
    })
}


