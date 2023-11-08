import React from 'react'
import { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { userLogin } from '../store/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from '../store/type/authType'

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    const{authenticate, successMessage, error} = useSelector(state=> state.auth)

    //state 
    const [state, setState] = useState({
        email: '',
        password: '',
    })

    //handle inputfield
    const inputChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    //handle login
    const login = (event) =>{

        event.preventDefault()     
        dispatch(userLogin(state))

    }

    //alert window
    useEffect(()=>{
        if (authenticate){
            navigate('/')
        }
        if (error){
            error.map(err=> alert.error(err))
            dispatch({type:ERROR_CLEAR})
        }
        if (successMessage){
            alert.success(successMessage)
            dispatch({type: SUCCESS_MESSAGE_CLEAR})
        }
    }, [successMessage,error])

  return (
    <div className='register'>
        <div className='card'>
            <div className='card-header'>
                <h3>Login</h3>
            </div>
            <div className='card-body'>
                <form onSubmit={login}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' onChange= {inputChange} name='email' value={state.email}
                        className='form-control' placeholder='email' id='email'/>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='text' onChange= {inputChange} name='password' value={state.password}
                        className='form-control' placeholder='password' id='password'/>
                    </div>

                    <div className='form-group'>
                        <input type='submit' value="login" className='btn' />
                    </div>

                    <div className='form-group'>
                        <span><Link to="/chattingnow/register">Don't Have an Account?</Link></span>
                        
                    </div>
                    
                </form>

            </div>
        </div>
    </div>
  )
}

export default Login