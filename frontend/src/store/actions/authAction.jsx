import axios from 'axios'
import {LOGIN_FAIL, LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, LOGOUT_SUCCESS} from '../type/authType'

export const userRegister = (data) => {
    return async (dispatch) => {
        const config = {
            //data will pass as json format
            headers: {
                accept: "application/json",
                "Accept-Language": "en-US,en;q=0.8",
                "Content-Type": `multipart/form-data;`,
            }
        }
        try{
            const response = await axios.post(
                '/api/chattingnow/user-register', data, config) //store in localstorage
            localStorage.setItem('authToken', response.data.token)

            dispatch({
                type: REGISTER_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    token: response.data.token
                }
            })

        }catch(error){
            dispatch ({
                type: REGISTER_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }
    }
}

export const userLogin =(data)=> {
    return async (dispatch) =>{
        const config = {
            //data will pass as json format
            headers: {
                "Content-Type": "application/json",
            }
        }
        try{
            const response = await axios.post(
                '/api/chattingnow/user-login', data, config) //store in localstorage
            localStorage.setItem('authToken', response.data.token)

            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    token: response.data.token
                }
            })

        }catch(error){
            dispatch ({
                type: LOGIN_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }
    }
} 

export const userLogout = () => async(dispatch) => {
    try{
        const response = await axios.post('/api/chattingnow/user-logout')
        if (response.data.success){
            localStorage.removeItem('authToken') //remove authtoken in local storage
            dispatch({
                type: LOGOUT_SUCCESS
            })
        }
    }catch(error){
        console.log(error.response.data)
    }
}