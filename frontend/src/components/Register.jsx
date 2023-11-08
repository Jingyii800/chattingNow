import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import { userRegister } from '../store/actions/authAction'
import { useAlert } from 'react-alert'
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from '../store/type/authType'

const Register = () => {

    const alert = useAlert()

    const navigate = useNavigate()

    const {authenticate, error, successMessage} = useSelector(state=>state.auth)
    
    const dispatch = useDispatch()

    const [state, setState] = useState({
        username: '',
        email:'',
        password:'',
        confirmPassword:'',
        image:''
    })

    // load image
    const [loadImage, setLoadImage] = useState('')

    //handle text and email
    const inputHandle= (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }
    //handle image
    const fileHandle =(event) =>{
        if (event.target.files.length !== 0){
            setState({
                ...state,
                [event.target.name]: event.target.files[0]
            })
        }

        //show uploaded image on register page
        const reader = new FileReader()
        reader.onload = () => {
            setLoadImage(reader.result)
        }
        reader.readAsDataURL(event.target.files[0])
    }

    // handle register and dispatch
    const register = (event) => {

        // const {username, email, confirmPassword, password, image} = state

        event.preventDefault()

        // const formData = new FormData()
        // formData.append('username', username)
        // formData.append('email', email)
        // formData.append('confirmPassword', confirmPassword)
        // formData.append('password', password)
        // formData.append('image', image)

        dispatch(userRegister(state))
    }
    
    //alert window
    useEffect(()=>{

        if(authenticate){
            navigate('/')
        }
   
        if (successMessage){
            alert.success(successMessage)
            dispatch({type: SUCCESS_MESSAGE_CLEAR})
        }
        if(error){
            error.map(err=> alert.error(err))
            dispatch({type: ERROR_CLEAR})
        }

    }, [successMessage,error])


  return (
    <div className='register'>
        <div className='card'>
            <div className='card-header'>
                <h3>Register</h3>
            </div>
            <div className='card-body'>
                <form onSubmit={register}>
                    <div className='form-group'>
                        <div className='file-image'>
                            <div className='image'>
                                {/* if has image, load image in the place */}
                                {loadImage ? <img src={loadImage}/> : ''}
                            </div>
                            <div className='file'>
                                <label htmlFor='image'>Profile Picture</label>
                                <input type='file'  onChange={fileHandle} name='image'
                                className='form-control' id='image' />
                            </div>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='username'>Username</label>
                        <input type='text' onChange={inputHandle} name='username' value = {state.username} 
                        className='form-control' placeholder='username' id='username'/>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' onChange={inputHandle} name='email' value = {state.email} 
                        className='form-control' placeholder='email' id='email'/>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='text' onChange={inputHandle} name='password' value = {state.password} 
                        className='form-control' placeholder='password' id='password'/>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input type='text' onChange={inputHandle} name='confirmPassword' value = {state.confirmPassword}
                        className='form-control' placeholder='comfirm password' id='confirmPassword'/>
                    </div>

                    <div className='form-group'>
                        <input type='submit' value="register" className='btn' />
                    </div>

                    <div className='form-group'>
                        <span><Link to="/chattingnow/login">Login Your Account</Link></span>
                        
                    </div>
                    
                </form>

            </div>
        </div>
    </div>
  )
}

export default Register