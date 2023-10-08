const UserModel = require("../../models/User");
const bcrypt = require('bcrypt')

class SAClientController {

    static index = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            const clients = await UserModel.find({ role: 'Admin' })

            res.render('superAdmin/client/index',{userData, clients, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

    static addClient = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            res.render('superAdmin/client/add',{userData, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

    static clientInsert = async(req,res) => {
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
                req.flash('succMsg','Client Registered Successfully')
                res.redirect('/superAdmin/client')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/superAdmin/addClient') 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect('/superAdmin/addClient')
        }
    }

    static changeClientStatus = async(req,res) => {
        try {
            const client = await UserModel.findById(req.params.id )

            if (client.status == 'active') {
                var data = await UserModel.findByIdAndUpdate(req.params.id, {
                    status: 'inactive'
                })
            } else {
                var data = await UserModel.findByIdAndUpdate(req.params.id, {
                    status: 'active'
                })
            }

            if (data) {
                req.flash('succMsg','Client Status Changed Successfully')
                res.redirect('/superAdmin/client')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/superAdmin/addClient') 
            }
        } catch (err) {
            req.flash('error',err)
            res.redirect('/superAdmin/client')
        }
    }

    static editClient = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            const client = await UserModel.findById(req.params.id)

            res.render('superAdmin/client/edit',{userData, client, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            req.flash('error',err)
            res.redirect(`/superAdmin/client`)
        }
    }

    static clientUpdate = async(req,res) => {
        try{
            // console.log(req.body)
            const { name, userName, firmName, phone, email, city, address } = req.body
            const data = await UserModel.findByIdAndUpdate(req.params.id, {
                name : name,
                userName : userName,
                firmName : firmName,
                phone : phone,
                email : email,
                city: city,
                address: address,
            })
            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','Client Updated Successfully')
                res.redirect('/superAdmin/client')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect(`/superAdmin/editClient/${req.params.id}`) 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect(`/superAdmin/editClient/${req.params.id}`)
        }
    }

    static deleteClient = async(req,res) => {
        try {
            const client = await UserModel.findById(req.params.id)

            if (client.isDeleted == 0) {
                var data = await UserModel.findByIdAndUpdate(req.params.id, {
                    isDeleted: 1,
                    status: 'inactive'
                })
            } else {
                var data = await UserModel.findByIdAndUpdate(req.params.id, {
                    isDeleted: 0
                })
            }

            if (data) {
                req.flash('succMsg','Client Deleted Successfully')
                res.redirect('/superAdmin/client')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/superAdmin/client') 
            }
        } catch (err) {
            req.flash('error',err)
            res.redirect('/superAdmin/client')
        }
    }

}
module.exports = SAClientController