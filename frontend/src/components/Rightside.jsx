import React from 'react'
import {FaPhoneFlip,FaVideo,FaCircleInfo} from "react-icons/fa6"
import Message from './Message'
import SendMessage from './SendMessage'
import FriendInfo from './FriendInfo'
const Rightside = ({currentFriend, message, inputHandle, sendMessage, messages,scrollRef, emojiSend, imageSend, activeUser, typingMessage}) => {
  return (
    <div className='col-9'>
        <div className='right-side'>
            <input type='checkbox' id='dot' />
            <div className='row'>
                <div className='col-8'>
                    <div className='message-send-show'>
                        <div className='header'>
                            <div className='image-name'>
                                <div className='image'>
                                    <img src={`image/${currentFriend.image}`} alt='' />
                                    {
                                        activeUser && activeUser.length>0 && 
                                        activeUser.some(au => au.userId === currentFriend._id)?
                                        <div className='active-icon'></div> : ''
                                    }
                                    
                                </div>
                                <div className='name'>
                                    <h3>{currentFriend.username}</h3>
                                </div>
                            </div>
                            <div className='icons'>
                                <div className='icon'>
                                    <FaPhoneFlip />
                                </div>
                                <div className='icon'>
                                    <FaVideo />
                                </div>
                                <div className='icon'>
                                    <label htmlFor='dot'><FaCircleInfo /></label>
                                </div>
                            </div>
                        </div>
                        <Message 
                        messages={messages}
                        currentFriend={currentFriend}
                        scrollRef={scrollRef}
                        typingMessage={typingMessage}/>
                        <SendMessage
                        message = {message}
                        inputHandle = {inputHandle}
                        sendMessage={sendMessage}
                        emojiSend={emojiSend}
                        imageSend = {imageSend}/>
                    </div>
                </div>
                <div className='col-4'>
                    <FriendInfo currentFriend={currentFriend} activeUser={activeUser}
                    messages={messages}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Rightside