import React from 'react'
import {FaSquareCaretDown} from 'react-icons/fa6'

const FriendInfo = ({currentFriend, activeUser, messages}) => {
  return (
    <div className='friend-info'>
        <input type="checkbox" id='gallery' />
        <div className='image-name'>
            <div className='image'>
                <img src ={`image/${currentFriend.image}`} alt='' />
            </div> 
            {
                activeUser && activeUser.length>0 && 
                activeUser.some(au => au.userId === currentFriend._id)? 
                <div className='active-user'>Active</div> :''
            }
            <div className='name'>
                <h4>{currentFriend.username}</h4>
            </div>
        </div>

        <div className='others'>
            <div className='custom-chat'>
                <h3>Customize Chat</h3>
                <FaSquareCaretDown />
            </div>
            <div className='privacy'>
                <h3>Privacy and Support</h3>
                <FaSquareCaretDown />
            </div>

            <div className='media'>
                <h3>Shared Media</h3>
                <label htmlFor='gallery'><FaSquareCaretDown/></label> 
            </div>
        </div>

        <div className='gallery'>
            {
                messages && messages.length > 0 ? messages.map(m => m.message.image &&
                    <img src={`./image/${m.message.image}`} alt=''/>) : ''
            }
        </div>

    </div>
    
  )
}

export default FriendInfo