import React from 'react'
import {FaCirclePlus, FaFileImage, FaMicrophone, FaPaperPlane} from 'react-icons/fa6'

const SendMessage = ({message, inputHandle, sendMessage, emojiSend, imageSend}) => {

    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲',
        '🥹', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😵',
        '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
        '😎',
    ]
  return (
    <div className='message-send-section'>
        <input type='checkbox' id='emoji'/>
        <div className='file hover-attachment'>
            <div className='add-attachment'>
                Add Attachment
            </div>
            <FaCirclePlus />
        </div>

        <div className='file hover-image'>
            <div className='add-image'>
                Add Image
            </div>
            <input onChange={imageSend} type='file' id="pic" className='form-control'/>
            <label htmlFor='pic'><FaFileImage /></label>
        </div>

        <div className='file hover-gift'>
            <div className='add-gift'>
                Voice Message
            </div>
            <FaMicrophone />
        </div>

        <div className='message-type'>
            <input type="text" name='message' placeholder='Message' 
            id='message' className='form-control'
            onChange={inputHandle} value={message}/>  
            <div className='file hover-gift'>
                <label htmlFor='emoji'>☺️</label>
            </div>      
        </div>

        <div onClick={sendMessage} className='file'>
        <FaPaperPlane/>
        </div>

        <div className='emoji-section'>
            <div className='emoji'>
                {
                    emojis.map(emoji=><span onClick={()=>emojiSend(emoji)}>{emoji}</span>)
                }
            </div>
        </div>
    </div>
  )
}

export default SendMessage