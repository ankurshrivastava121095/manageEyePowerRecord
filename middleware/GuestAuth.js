const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')

const GuestAuth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt
        if (token) {
            res.redirect('/admin/dashboard')
        } else {
            next()
        }
    }catch(err){
        res.redirect('/')
    }
}

module.exports = GuestAuth