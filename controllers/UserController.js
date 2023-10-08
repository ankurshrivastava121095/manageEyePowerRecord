const UserModel = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const TokenModel = require("../models/Token")
const nodemailer = require("nodemailer");

class UserController{
    static login = async(req,res) => {
        try{
            res.render('guest/login',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err)
        }
    }

    static register = async(req,res) => {
        try{
            res.render('guest/register',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err)
        }
    }

    static smsUser = async(req,res) => {
        try{
            res.render('guest/smsUser',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err)
        }
    }

    static userInsert = async(req,res) => {
        try{
            // console.log(req.body)
            const { name, userName, firmName, phone, email, password, role, city, address } = req.body
            const hashPassword = await bcrypt.hash(password,10)
            const data = new UserModel({
                name : name,
                userName : userName,
                firmName : firmName,
                phone : phone,
                email : email,
                password : hashPassword,
                role : role,
                city: city,
                address: address,
            })
            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','User Registered Successfully')
                res.redirect('/')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/sabkabaap') 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect('/sabkabaap')
        }
    }

    static userUpdate = async(req,res) => {
        try{
            // console.log(req.body)
            const { name, userName, firmName, phone, email, role, city, address } = req.body
            const data = await UserModel.findByIdAndUpdate(req.params.id,{
                name: name,
                userName: userName,
                firmName: firmName,
                phone: phone,
                email: email,
                role: role,
                city: city,
                address: address,
            })

            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','User Updated Successfully')
                res.redirect('/')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/') 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect('/')
        }
    }

    static changeUserStatus = async(req,res) => {
        try{
            // console.log(req.body)
            const user = await UserModel.findById(req.params.id)
            const status = user.status
            if (status == 'active') {
                var data = await UserModel.findByIdAndUpdate(req.params.id,{
                    status: 'deactive',
                })
            } else {
                var data = await UserModel.findByIdAndUpdate(req.params.id,{
                    status: 'active',
                })
            }

            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','User Updated Successfully')
                res.redirect('/')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/') 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect('/')
        }
    }

    static deleteUser = async(req,res) => {
        try{
            // console.log(req.body)
            const data = await UserModel.findByIdAndUpdate(req.params.id, {
                isDeleted: 1
            })

            const dataDeleted = data.save()

            if (dataDeleted) {
                req.flash('succMsg','User deleted Successful')
                res.redirect('/')
            } else {
                req.flash('error','User did not delete')
                res.redirect('/')
            }
        }catch(err){
            console.log(err);
        }
    }

    static loginVerify = async(req,res) => {
        try{
            // console.log(req.body)
            const {email, password} = req.body
            // console.log(password)
            if (email && password) {
                const user = await UserModel.findOne({email : email})
                // console.log(user)
                if (user != null) {
                    const isMatched = await bcrypt.compare(password,user.password)
                    if ((user.email === email) && isMatched) {
                        //generate jwt token
                        const token = jwt.sign({ userId: user._id }, 'Ophthalmologist');
                        // console.log(token)
                        res.cookie('jwt',token)
                        // res.redirect('/admin/dashboard')


                        //additional code for cams
                        if (user.status == 'active' && user.isDeleted == 0) {
                            if (user.role == 'Super Admin') {
                                res.redirect('/superAdmin/dashboard')
                            } else {
                                res.redirect('/admin/dashboard')
                            }
                        } else {
                            res.clearCookie('jwt')
                            req.flash('error','User no longer Active !')
                        res.redirect('/')
                        }
                    } else {
                        req.flash('error','Email and Password is not valid !')
                        res.redirect('/')
                    }
                } else {
                    req.flash('error','You are not registered user !')
                    res.redirect('/')
                }
            } else {
                req.flash('error','All Fields are required !')
                res.redirect('/')
            }
        }catch(err){
            console.log(err)
        }
    }

    static forgetPassword = async(req,res) => {
        try{
            res.render('guest/forgetPassword',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err)
        }
    }

    static otpVerificationForForgetPassword = async(req,res) => {
        try{
            res.render('guest/otpVerificationForForgetPassword',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err)
        }
    }

    static newPassword = async(req,res) => {
        try{
            const checkTokenData = await TokenModel.find().count()

            if(checkTokenData != 0){
                res.render('guest/newPassword',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
            }else{
                req.flash('error','Error !')
                res.redirect('/')
            }
        }catch(err){
            console.log(err)
        }
    }

    static checkEMailForgetPasswordAndSendOtp = async(req,res) => {
        try{
            const { email } = req.body

            const userFound = await UserModel.findOne({ email: email })

            if(userFound){ 

                const isTokenExist = await TokenModel.find()

                if(isTokenExist){
                    await TokenModel.deleteMany({})

                    var token = await new TokenModel({
                        email: email,
                        token: Math.floor(100000 + Math.random() * 900000),
                    }).save();
                }else{
                    var token = await new TokenModel({
                        email: email,
                        token: Math.floor(100000 + Math.random() * 900000),
                    }).save();
                }

                if(token){
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        host: "smtp.gmail.com",
                        // port: 587,
                        port: 465,
                        auth: {
                            user: 'arclightdevelopmentsolutions@gmail.com',
                            pass: 'ovvjhpaukdbokznd'
                        },
                    });
    
                    let info = await transporter.sendMail({
                        from: '"ArcLight Development Solutions Pvt Ltd" <arclightdevelopmentsolutions@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Email Verification for Forget Password", // Subject line
                        text: `Hello ${email}`, // plain text body
                        html: `<b>Hello ${email}, Your Forget Password Verification Code is ${token.token} !</b>`, // html body
                    });

                    if(info){
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        req.flash('succMsg','OTP Sent, Please check Email !')
                        res.redirect('/otpVerificationForForgetPassword')
                    }else{
                        req.flash('error','Error, Unable to send OTP !')
                        res.redirect('/forgetPassword')
                    }
                }else{
                    req.flash('error','Error !')
                    res.redirect('/forgetPassword')
                }
            }else{
                req.flash('error','Email not update !')
                res.redirect('/forgetPassword')
            }
        }catch(err){
            console.log(err)
        }
    }

    static verifyOTPForForgetPassword =  async(req,res) => {
        try{
            const { token } = req.body

            const isOTPExist = await TokenModel.findOne({ token: token })

            // console.log(isOTPExist)

            if(isOTPExist){
                // const deleteOTPData = await TokenModel.deleteOne({ token: token })

                req.flash('succMsg','User Verified !')
                res.redirect('/newPassword')
            }else{
                req.flash('error','Invalid OTP, Please Enter Correct OTP !')
                res.redirect('/otpVerificationForForgetPassword')
            }
        }catch(err){
            console.log(err)
        }
    }

    static updatePasswordForForgetPassword = async(req,res) => {
        try{
            const { password, conPassword } = req.body

            if(password !== conPassword){
                req.flash('error','Password does not match !')
                res.redirect('/newPassword')
            }else{
                const hashPassword = await bcrypt.hash(password,10)
                const user = await UserModel.updateOne({}, { $set: {password: hashPassword}})

                if(user){
                    const checkTokenData = await TokenModel.findOne()
                    await TokenModel.deleteOne({ token: checkTokenData.token })
                    req.flash('succMsg','Password Changed Successfully, Please Login !')
                    res.redirect('/')
                }else{
                    req.flash('error','Error, Password did not update !')
                    res.redirect('/newPassword')
                }
            }
        }catch(err){
            console.log(err)
        }
    }

    static logout = async(req,res) => {
        try{
            res.clearCookie('jwt')
            res.redirect('/')
        }catch(err){
            console.log(err)
        }
    }

    static updateProfile = async(req,res) => {
        try{
            const { name, userName, firmName, phone, email, city, address } = req.body
            
            const data = await UserModel.findByIdAndUpdate(req.params.id,{
                name: name,
                userName: userName,
                firmName: firmName,
                email: email,
                phone: phone,
                city: city,
                address: address,
            })

            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','Profile updated Successful')
                res.redirect(path)
            } else {
                req.flash('error','Profile did not update')
                res.redirect(path)
            }
        }catch(err){
            console.log(err)
        }
    }

    static updatePassword = async(req,res) => {
        try{
            
        }catch(err){
            console.log(err);
        }
    }

}
module.exports = UserController