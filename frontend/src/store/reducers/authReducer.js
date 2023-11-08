import { ERROR_CLEAR, LOGIN_FAIL, LOGIN_SUCCESS, REGISTER_FAIL, 
    REGISTER_SUCCESS, SUCCESS_MESSAGE_CLEAR, LOGOUT_SUCCESS } from "../type/authType"
import deCodeToken from 'jwt-decode'

const authState = {
    loading: true,
    authenticate: false,
    error: '',
    successMessage: '',
    myInfo: ''
}

//token decode
const tokenDecode = (token) => {
    const tokendecoded = deCodeToken(token)
    const expTime = new Date(tokendecoded.exp*1000)
    if (new Date() > expTime){
        return null
    }return tokendecoded
}

// load redux token from localstorage, not directly from input or post
//even page refresh, can also see the token in redux
const getToken = localStorage.getItem('authToken')
if (getToken){
    const getInfo = tokenDecode(getToken)
    if (getInfo){
        authState.myInfo = getInfo
        authState.authenticate = true
        authState.loading = false
    }
}

export const authReducer = (state = authState, action) => {
    const {payload, type} = action

    if (type===REGISTER_FAIL || type===LOGIN_FAIL){
        return {
            ...state,
            error: payload.error,
            authenticate: false,
            myInfo: '',
            loading: true,
        }
    }

    if (type===REGISTER_SUCCESS || type===LOGIN_SUCCESS){
        const myInfo = tokenDecode(payload.token)
        return {
            ...state,
            myInfo: myInfo, 
            successMessage: payload.successMessage,
            error: '',
            authenticate: true,
            loading: false
        }
    }

    if (type===SUCCESS_MESSAGE_CLEAR){
        return{
            ...state,
            successMessage: '',
        }
    }

    if (type===ERROR_CLEAR){
        return{
            ...state,
            error: '',
        }
    }

    if (type === LOGOUT_SUCCESS) {
        return {
            ...state,
            authenticate: false,
            loading: true,
            myInfo: '',
            successMessage: 'Logout Success'
        }

    }

    return state
}