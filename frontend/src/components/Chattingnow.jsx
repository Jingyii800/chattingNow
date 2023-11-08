import React, {useEffect, useState, useRef} from 'react'
import { FaEllipsis,FaPenToSquare,FaSistrix,FaArrowRightFromBracket } from "react-icons/fa6";
import Friends from './Friends';
import Rightside from './Rightside';
import {useDispatch, useSelector} from 'react-redux'
import { getFriends, getMessage, imageMessageSend, messageSend, seenMessage, updateMessage, getTheme, themeSet } from '../store/actions/messageAction';
import {userLogout} from '../store/actions/authAction'
import {io} from 'socket.io-client'
import toast , {Toaster} from 'react-hot-toast'
import useSound from 'use-sound'
import notificationSound from '../audio/notification.mp3'
import sendingSound from '../audio/sending.mp3'
import { NEW_USER_ADD_CLEAR } from '../store/type/chattingType';

const Chattingnow = () => {

    //load sound
    const [notificationPlay] = useSound(notificationSound)
    const [sendingPlay] = useSound(sendingSound)

    //automatically show the lastest sending message
    const scrollRef = useRef()

    //current friend chatting display
    const [currentFriend, setCurrentFriend] = useState('')
    //message handle
    const [message, setMessage] = useState('')
    //real-time message from socket
    const [socketMessage, setSocketMessage] = useState('')
    //active user
    const [activeUser, setActiveUser] = useState([]) // they are array data
    //typing message status
    const [typingMessage, setTypingMessage] = useState('')
    //get data from middleware
    const {friends, messages, messageSendSuccess, message_get_success, theme, new_user_add} = useSelector(state => state.chattingnow)
    const {myInfo} = useSelector(state=> state.auth)
    

    const dispatch = useDispatch()
    //use socket
    const socket = useRef()
    useEffect(()=> {
        socket.current = io ('ws://localhost:8000')
        //get real-time message if users are both active
        socket.current.on('getMessage',(data) => {
            setSocketMessage(data);
        })
        //get typingmessage
        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data)
        })
        socket.current.on('messageSeenResponse', (msg)=>{
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })
        socket.current.on('deliveredMessage', msg=>{
            dispatch({
                type: 'DELIVERED_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })
        socket.current.on('seenSuccess', data=> {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })
    },[])

    // dispatch real-time message
    useEffect(()=>{
        if (socketMessage && currentFriend){
            if(socketMessage.senderId === currentFriend._id && 
                socketMessage.recevierId === myInfo.id){
                    dispatch({
                        type: 'SOCKET_MESSAGE',
                        payload: {
                            message: socketMessage
                        }
                    })
                    dispatch({
                        type: 'UPDATE_FRIEND_MESSAGE',
                        payload:{
                            msgInfo: socketMessage,
                            status: 'seen'
                        }
                    })
                    dispatch(seenMessage(socketMessage))
                    socket.current.emit('messageSeen', socketMessage)
            }
        }
        setSocketMessage('')
    }, [socketMessage])

    useEffect(()=> { //pass data to socket
        socket.current.emit('addUser', myInfo.id, myInfo)
    },[])
    useEffect(()=> { 
        // get all active users from socket
        socket.current.on('getUser', (users)=> {
            const filter = users.filter(user => user.userId !== myInfo.id)//filter me
            setActiveUser(filter)
        })
        socket.current.on('new_user_add', data => {
            dispatch({
                type: 'NEW_USER_ADD',
                payload: {
                    new_user_add: data
                }
            })
        })
    },[])

    //notification display
    useEffect(()=>{
        if (socketMessage.senderId !== currentFriend._id 
            && socketMessage.recevierId === myInfo.id){
            notificationPlay()
            toast.success(`${socketMessage.senderName} Send A New Message`)
            dispatch(updateMessage(socketMessage)) //deliver message
            socket.current.emit('deliveredMessage',socketMessage);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload : {
                    msgInfo : socketMessage,
                    status : 'delivered'
                }
            })
            
        }
    },[socketMessage])

    //dispatch friends from middleware
    useEffect(()=> {
        dispatch(getFriends())
        dispatch({type: 'NEW_USER_ADD_CLEAR'})
    }, [new_user_add])

    //handle message input
    const inputHandle = (event) => {
        setMessage(event.target.value)

        //typing message socket
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            recevierId: currentFriend._id,
            msg: event.target.value
        })
    }

    //send message
    const sendMessage = (event) => {
        event.preventDefault()
        sendingPlay()
        const data = {
            senderId: myInfo.id,
            senderName: myInfo.username,
            recevierId: currentFriend._id,
            message: message ? message: '',
        }

        //after sending message, typingMessage will be empty
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            recevierId: currentFriend._id,
            msg: ''
        })
        dispatch(messageSend(data))
        setMessage('')
    }
    // make sure the socket message also from database
    useEffect(()=> {
        if (messageSendSuccess) {
            socket.current.emit('sendMessage', messages[messages.length-1])
            dispatch({ //change seen/unseen state
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: messages[messages.length-1],
                    status: 'delivered'
                }
            })
            dispatch({
                type: 'MESSAGE_SEND_SUCCESS_CLEAR'
            })
        }
    },[messageSendSuccess])
    
    //dispatch and get message
    useEffect(()=> {
        dispatch(getMessage(currentFriend._id))
    },[currentFriend?._id]) //if any currrent friend, get id

    useEffect(()=>{
        if (messages.length>0){
            if (messages[messages.length-1].senderId !== myInfo.id && 
                messages[messages.length-1].status !== 'seen'){
                    dispatch({
                        type: 'UPDATE',
                        payload: {
                            id: currentFriend._id
                        }
                    })
                    socket.current.emit('seen', {
                        senderId: currentFriend._id, 
                        recevierId: myInfo.id
                    })
                    dispatch(seenMessage({
                        _id: messages[messages.length-1]._id
                    }))

            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR'
        })
    },[message_get_success])

    //default display the top friend chatting page
    useEffect(()=> {
        if (friends && friends.length>0){
            setCurrentFriend(friends[0].fndInfo)
        }
    }, [friends])
    
    //automatically scroll and show the last message
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    },[messages])

    //send emoji and files
    const emojiSend = (emo) => {
        setMessage(`${message}`+ emo)
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            recevierId: currentFriend._id,
            msg: emo
        })
    }

    //send files
    const imageSend = (event) => {
        sendingPlay()
        if (event.target.files.length !== 0){
            const imageName = event.target.files[0].name
            const newImageName = Date.now() + imageName

            //send it to socket
            socket.current.emit('sendMessage', {
                senderId: myInfo.id,
                senderName: myInfo.username,
                recevierId: currentFriend._id,
                time: new Date(),
                message: {
                    text: '',
                    image: newImageName
                }
            })            
            //send it to backend
            const formData = new FormData()
            formData.append('imageName', newImageName)
            formData.append('senderName', myInfo.username)
            formData.append('recevierId', currentFriend._id)
            formData.append('image', event.target.files[0])

            dispatch(imageMessageSend(formData))
        }
    }

    const [hide, setHide] = useState(true)

    const logout = () => {
        dispatch(userLogout())
        socket.current.emit('logout', myInfo.id)
    }

    //dark/day mode
    useEffect( ()=> {
        dispatch(getTheme())
    },[])

    //search Friend use DOM
    const search = (e) => {
        const getFriendClass = document.getElementsByClassName('hover-friend')
        const friendNameClass = document.getElementsByClassName('Fd_name')
        console.log(getFriendClass)
        console.log(friendNameClass)
        for(var i = 0; i < getFriendClass.length, i < friendNameClass.length; i++){
            let text = friendNameClass[i].innerText.toLowerCase()
            // if can match the input char in the text (username)
            // which means index > 0, cannot match then index == -1
            if(text.indexOf(e.target.value.toLowerCase()) > -1){
                getFriendClass[i].style.display = '' //display this friend
            } else{
                getFriendClass[i].style.display= 'none' //display none
            }
        }
    }

  return (
    <div className={ theme === 'dark' ? 'chattingnow theme': 'chattingnow'}>
        <div>
            <Toaster 
            position={'top-right'}
            reverseOrder={false}
            toastOptions={{
                style: {
                    fontSize: '14px'
                }
            }}
            />
        </div>
        <div className='row'>
            <div className='col-3'>
                <div className='left-side'>
                    <div className='top'>
                        <div className='image-name'>
                            <div className='image'>
                                <img src={`image/${myInfo.image}`} alt=''/>
                            </div>
                            <div className='name'>
                                <h3>{myInfo.username}</h3>
                            </div>
                        </div>
                        <div className='icons'>
                            <div className='icon'>
                                <FaPenToSquare />
                            </div>
                            <div onClick={()=> setHide(!hide)}className='icon'>
                                <FaEllipsis />
                            </div>
                            <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                <h3>Dark Mode</h3>
                                <div className='on'>
                                    <label htmlFor='dark'>ON</label>
                                    <input onChange={(e) => dispatch(themeSet(e.target.value))} 
                                    type='radio' value="dark" name="theme" id = "dark"/>
                                </div>
                                <div className='off'>
                                    <label htmlFor='day'>OFF</label>
                                    <input onChange={(e) => dispatch(themeSet(e.target.value))} 
                                    type='radio' value="day" name="theme" id = "day"/>
                                </div>
                                <div onClick={logout}className='logout'>
                                    <FaArrowRightFromBracket /> Logout
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='friend-search'>
                        <div className='search'>
                            <button><FaSistrix/></button>
                            <input onChange={search} type='text' placeholder='Search' 
                            className='form-control'></input>
                        </div>
                    </div>
                    {/* <div className='active-friends'>
                        {
                            activeUser && activeUser.length > 0 ? 
                            activeUser.map(au => <ActiveFriend 
                                activeFriend={au}
                                setCurrentFriend = {setCurrentFriend}/>) :''
                        }
                        
                    </div> */}
                    <div className='friends'>
                        {
                            friends && friends.length>0 ? friends.map((fd) => 
                            <div onClick={()=> setCurrentFriend(fd.fndInfo)} 
                            className={currentFriend._id===fd.fndInfo._id ? 
                            'hover-friend active': 'hover-friend'}>
                            <Friends friend={fd} activeUser={activeUser}/>
                            </div>): "No Friend"
                        }
                        
                    </div>
                </div>
            </div>
            {
                currentFriend ? <Rightside 
                currentFriend={currentFriend}
                message={message}
                inputHandle={inputHandle}
                sendMessage={sendMessage}
                messages={messages}
                scrollRef={scrollRef}
                emojiSend={emojiSend}
                imageSend={imageSend}
                activeUser={activeUser}
                typingMessage={typingMessage}/> :'Please Select Your Friend'
            }
        </div>
    </div>
  )
}

export default Chattingnow