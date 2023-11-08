import React from 'react';
import {useSelector} from 'react-redux'
import moment from 'moment'
import { FaEye, FaRegCircleCheck } from 'react-icons/fa6';

const Friends = ({friend, activeUser}) => {
     const {myInfo} = useSelector(state=> state.auth)
     const {fndInfo, msgInfo} = friend

  return (
       <div className='friend'>
            <div className='friend-image'>
                 <div className='image'>
                 <img src = {`image/${fndInfo.image}`} alt='' />
                 {
                    activeUser && activeUser.length > 0 && 
                    activeUser.some(u => u.userId === fndInfo._id )?
                    <div className='active_icon'></div> :''
                 }
                 
                 </div>
            </div>

            <div className='friend-name-seen'>
                 <div className='friend-name'>
                      <h4 className={msgInfo?.senderId!== myInfo.id && 
                      msgInfo?.status !== 'seen' && msgInfo?.status !== undefined?
                      'unseen_message Fd_name': 'Fd_name'}>{fndInfo.username}</h4>

                      <div className='msg-time'>
                         {
                              msgInfo && msgInfo.senderId === myInfo.id ?
                              <span>You: </span> : <span></span>
                         }
                         {
                              msgInfo && msgInfo.message.text ?
                              <span className={msgInfo?.senderId!==myInfo.id &&
                              msgInfo?.status !== undefined && msgInfo.status !== "seen" ?
                         'unseen_message' : ''}>{msgInfo.message.text.slice(0,12)}</span>: 
                              msgInfo && msgInfo.message.image ? <span>Send a Image</span>:
                              <span>Connect you</span>
                         }
                         <span> - {msgInfo? moment(msgInfo.createdAt).startOf('mini').fromNow():
                         moment(fndInfo.createdAt).startOf('mini').fromNow()}</span>
                      </div>
                 </div>
                 {
                    myInfo.id === msgInfo?.senderId?
                    <div className='seen-unseen-icon'>
                         {
                              msgInfo.status === 'seen'? 
                              <FaEye /> : 
                              msgInfo.status === 'delivered' ?
                              <div className='delivered'>
                                   <FaRegCircleCheck />
                              </div>: <div className='unseen'></div>
                         }
                         
                    </div>:
                    <div className='seen-unseen-icon'>
                         {
                              msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ?
                              <div className='seen-icon'></div> : ''
                         }
                         
                    </div>
                 }
            </div>

       </div>
  )
};

export default Friends;