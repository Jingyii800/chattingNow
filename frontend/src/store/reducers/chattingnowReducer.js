import { FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS, 
    SOCKET_MESSAGE, UPDATE_FRIEND_MESSAGE, MESSAGE_SEND_SUCCESS_CLEAR, SEEN_MESSAGE, 
    DELIVERED_MESSAGE, UPDATE, MESSAGE_GET_SUCCESS_CLEAR, SEEN_ALL,
    THEME_SET_SUCCESS, THEME_GET_SUCCESS, LOGOUT_SUCCESS, NEW_USER_ADD,NEW_USER_ADD_CLEAR} from "../type/chattingType"

const chattingnowState = {
    friends: [],
    messages:[],
    messageSendSuccess: false,
    message_get_success: false,
    theme: '',
    new_user_add: ''
}

export const chattingnowReducer = (state=chattingnowState, action)=>{
    const {payload, type} = action

    if(type===FRIEND_GET_SUCCESS){
        return {
            ...state,
            friends: payload.friends
        }
    }

    if(type===MESSAGE_GET_SUCCESS){
        return {
            ...state,
            message_get_success: true,
            messages: payload.messages
        }
    }

    if(type===MESSAGE_SEND_SUCCESS){
        return {
            ...state,
            messageSendSuccess: true,
            messages: [...state.messages, payload.messages]
        }
    }

    if(type===SOCKET_MESSAGE){
        return {
            ...state,
            messages: [...state.messages, payload.message]
        }
    }

    if (type === UPDATE_FRIEND_MESSAGE){
        const index = state.friends.findIndex(f=>f.fndInfo._id 
            === payload.msgInfo.recevierId || 
            f.fndInfo._id === payload.msgInfo.senderId)
        state.friends[index].msgInfo = payload.msgInfo
        state.friends[index].msgInfo.status = payload.status
        return {
            ...state
        }
    }

    if (type === MESSAGE_SEND_SUCCESS_CLEAR){
        return {
            ...state,
            messageSendSuccess: false
        }
    }

    if (type === SEEN_MESSAGE){
        const index = state.friends.findIndex(f=>f.fndInfo._id 
            === payload.msgInfo.recevierId || 
            f.fndInfo._id === payload.msgInfo.senderId)
            state.friends[index].msgInfo.status = 'seen'
            return {
                ...state
            }
    }

    if (type === DELIVERED_MESSAGE){
        const index = state.friends.findIndex(f=>f.fndInfo._id 
            === payload.msgInfo.recevierId || 
            f.fndInfo._id === payload.msgInfo.senderId)
            state.friends[index].msgInfo.status = 'delivered'
            return {
                ...state
            }
    }

    if(type === UPDATE){
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.id)
        if(state.friends[index].msgInfo){
            state.friends[index].msgInfo.status = 'seen'
        }
        return {
            ...state
        }
    }
    if (type === MESSAGE_GET_SUCCESS_CLEAR){
        return {
            ...state,
            message_get_success: false
        }
    }
    if (type === SEEN_ALL){
        const index = state.friends.findIndex(f=>f.fndInfo._id 
            === payload.recevierId)
            state.friends[index].msgInfo.status = 'seen'
        return {
            ...state
        }
    }
    if (type === THEME_GET_SUCCESS || type === THEME_SET_SUCCESS){
        return {
            ...state,
            theme: payload.theme
        }
    }
    if (type === LOGOUT_SUCCESS) {
        return {
            ...state,
            friends: [],
            messages:[],
            messageSendSuccess: false,
            message_get_success: false,
        }

    }
    if (type === NEW_USER_ADD) {
        return {
            ...state,
            new_user_add: payload.new_user_add
        }
    }
    if (type === NEW_USER_ADD_CLEAR) {
        return {
            ...state,
            new_user_add: ''
        }
    }


    return state
}
