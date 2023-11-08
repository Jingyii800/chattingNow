import React from 'react'

const ActiveFriend = ({activeFriend, setCurrentFriend}) => {
  return (
    <div className='active-friend' onClick={()=>setCurrentFriend({
      _id: activeFriend.userInfo.id,
      username: activeFriend.userInfo.username,
      email: activeFriend.userInfo.email,
      image: activeFriend.userInfo.image
    })}>
        <div className='image-active-icon'>
            <div className='image'>
                <img src={`/image/${activeFriend.userInfo.image}`} alt=''/>
                <div className='active-icon'></div>
            </div>
        </div>
    </div>
  )
}

export default ActiveFriend