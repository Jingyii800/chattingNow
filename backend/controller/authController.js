//valiadation
const formidable = require('formidable')
const validator = require('validator')
const registerModel = require('../models/authModel')
const fs = require('fs')
const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')

module.exports.userRegister = (req, res) => {

    const form = new formidable.IncomingForm()

    form.parse(req, async(err, fields, files) => {

        // console.log(fields)
        // console.log(files)

        const {
            username, email, confirmPassword, password
        } = fields


        const {image} = files

        const error = []

        if (!username[0]){
            error.push("Please type in your username")
        }

        if (!email[0]){
            error.push("Please type in your email")
        }

        if ( email && !validator.isEmail(`${email}`)){
            error.push("Email is invalid")
        }

        if (!password[0]){
            error.push("Please type in your password")
        }

        if (!confirmPassword[0]){
            error.push("Please confirm your password")
        }

        if (password[0] && confirmPassword[0] && password[0] !== confirmPassword[0]){
            error.push("Please confirm again")
        }

        if (password[0] && password[0].length < 3) {
            error.push("Password must be more than 3 characters")
        }

        if (Object.keys(files).length === 0) {
            error.push("Please upload your profile picture")
        }

        if (error.length > 0){
            res.status(400).json({
                error: {
                    errorMessage: error
                }
            })
        }else {
            const getImageName = files.image[0].originalFilename
            const randNumber = Math.floor(Math.random() * 99999)
            const newImageName = String(randNumber) + getImageName
            files.image[0].originalFilename = newImageName

            const newPath = path.join(__dirname, '../../frontend/public/image', files.image[0].originalFilename);
            try {
                const checkUser = await registerModel.findOne({
                     email:email[0]
                });
                if(checkUser) {
                     res.status(404).json({
                          error: {
                               errorMessage : ['Your email already exited']
                          }
                     })
                }else{
                    fs.copyFile(files.image[0].filepath, newPath, async(error) => {
                        if (error) {
                            console.error("Error copying file:", error);
                            res.status(500).json({
                                error: {
                                    errorMessage: ['Failed to copy image file.']
                                }
                            });
                            return;
                        }
            
                        const userCreate = await registerModel.create({
                            username: username[0],
                            email: email[0],
                            password: await bcrypt.hash(password[0], 10),
                            image: files.image[0].originalFilename,
                        });

                        //jwt to create token for these
                        const token = jwt.sign({
                            id: userCreate._id,
                            email:userCreate.email,
                            username: userCreate.username,
                            image: userCreate.image,
                            registerTime: userCreate.createdAt
                        }, process.env.SECRET,{
                            expiresIn: process.env.TOKEN_EXP
                        })//token expire
                        const options = {expires: new Date(Date.now()
                            + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)}// ms format
                        //return successful status
                        res.status(201).cookie('authToken', token, options).json({
                            successMessage: "Register Successful", token
                        })
            
                    })
               }
 
           } catch (error) {
                res.status(500).json({
                     error: {
                          errorMessage : ['Interanl Server Error']
                     }
                })
            }
        }
    })//end formidable
    
}

module.exports.userLogin = async (req, res) => {
    const error = []
    const {email, password} = req.body
    if(!email){
        error.push("Please provide your email")
    }
    if(!password){
        error.push("Please provide your password")
    }
    if(email && !validator.isEmail(email)){
        error.push("Email is invalid")
    }
    if(error.length > 0){
        res.status(400).json({
            error:{
                errorMessage: error
            }
        })
    }else{
        try{
            const check = await registerModel.findOne({
                email:email
            }).select('+password') // get password with the userinfo
            // user exists
            if(check){
                //check password
                const matchPassword = await bcrypt.compare(password, check.password)
                if (matchPassword){
                    const token = jwt.sign({
                        id: check._id,
                        email:check.email,
                        username: check.username,
                        image: check.image,
                        registerTime: check.createdAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    })
                    //create cookies for 1 day
                    const options = {expires: new Date(Date.now() + 
                        process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)}
                    res.status(200).cookie('authToken', token, options).json({
                        successMessage: "Login Successful", token
                    })
                }else{
                    res.status(400).json({
                        error:{
                            errorMessage:"Invalid Password"
                        }
                    })
                }
            }else{
                res.status(400).json({
                    error:{
                        errorMessage: "Account Not Found"
                    }
                })
            }

        }catch{
            res.status(404).json({
                error:{
                    errorMessage:"Internal Server Error"
                }
            })
        }
    }

}

module.exports.userLogout = (req, res) => {
    // remove token from cookie
    res.status(200).cookie('authToken', '').json({
        success: true
    })
}