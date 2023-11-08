import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const ProtectRoute = ({children}) => {
    // children is <Chattingnow />
    const {authenticate} = useSelector(state => state.auth)
    return authenticate ? children : <Navigate to = '/chattingnow/login' />
    // if not authenticate, redirect to login page
}
