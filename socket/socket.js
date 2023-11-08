const io = require('socket.io')(8000, {
    cors : {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

let users = []
const addUser = (userId, socketId, userInfo) => {
    const checkUser = users.some(u => u.userId === userId) //check if exists

    if (! checkUser){ //if not exist, add it
        users.push({userId, socketId, userInfo})
    }
}
const userRemove = (socketId) => { //filter logoutuser with this socket id
    users = users.filter(u => u.socketId !== socketId)
}

// find active friend, why 'return' because want new variable
const findFriend = (id) => {
    return users.find(u => u.userId === id)
}

//logout function
const userLogout = (userId) => {
    users = users.filter(u => u.userId !== userId)
}


io.on ('connection', (socket) => {
    console.log("connecting")
    socket.on('addUser', (userId, userInfo)=> {
        addUser(userId, socket.id, userInfo) //add user
        io.emit('getUser', users) //then pass users to frontend

        //fix bug: automatically display new register user in chatlist
        const us = users.filter(u=> u.userId!==userId)
        const con = "new_user_add"
        for (var i = 0; i < us.length ; i ++){
            socket.to(us[i].socketId).emit('new_user_add', con)
        }
    })

    socket.on('sendMessage', (data) => {
        const user = findFriend(data.recevierId)
        if (user !== undefined){
            io.emit('getMessage', (data))
        }
    })

    socket.on('messageSeen', msg => {
        const user = findFriend(msg.senderId)
        if (user !== undefined){
            socket.to(user.socketId).emit('messageSeenResponse', msg)
        }
    })

    socket.on('deliveredMessage', msg => {
        const user = findFriend(msg.senderId)
        if (user !== undefined){
            socket.to(user.socketId).emit('messageDeliveredResponse', msg)
        }
    })

    socket.on('seen', (data)=>{
        const user = findFriend(data.senderId)
        if (user !== undefined){
            socket.to(user.socketId).emit('seenSuccess', data)
        }
    })

    socket.on('typingMessage', (data) => {
        const user = findFriend(data.recevierId)
        if(user !== undefined){
            socket.to(user.socketId).emit('typingMessageGet', {
                senderId: data.senderId,
                recevierId: data.recevierId,
                msg: data.msg
            })
        }
    })

    socket.on('logout', userId => {
        userLogout(userId)
    })

    //inactive user
    socket.on('disconnect', ()=> {
        userRemove(socket.id)
        io.emit('getUser', users)
    })
})
