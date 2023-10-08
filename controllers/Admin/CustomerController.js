const CustomerModel = require("../../models/Customer")

class CustomerController {

    static index = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            const customers = await CustomerModel.find({ admin: _id })

            res.render('admin/customer/index',{userData, customers, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

    static addCustomer = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            res.render('admin/customer/add',{userData, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

    static customerInsert = async(req,res) => {
        try{
            // console.log(req.body);
            const { customerData, admin } = req.body

            const data = new CustomerModel({
                customerData : customerData,
                admin : admin,
            })
            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','Data Saved Successfully')
                res.redirect('/admin/customer')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/admin/addCustomer') 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect('/admin/addCustomer') 
        }
    }
    
    static editCustomer = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            const customer = await CustomerModel.findById(req.params.id)

            res.render('admin/customer/edit',{userData, customer, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }
    
    static customerUpdate = async(req,res) => {
        try{
            // console.log(req.body);
            const { customerData } = req.body

            const data = await CustomerModel.findByIdAndUpdate(req.params.id, {
                customerData : customerData,
            })
            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','Data Updated Successfully')
                res.redirect('/admin/customer')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect(`/admin/editCustomer/${req.params.id}`) 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect(`/admin/editCustomer/${req.params.id}`) 
        }
    }

    static deleteCustomer = async(req,res) => {
        try {
            const customer = await CustomerModel.findById(req.params.id)

            if (customer.isDeleted == 0) {
                var data = await CustomerModel.findByIdAndUpdate(req.params.id, {
                    isDeleted: 1,
                })
            } else {
                var data = await CustomerModel.findByIdAndUpdate(req.params.id, {
                    isDeleted: 0
                })
            }

            if (data) {
                req.flash('succMsg','Customer Deleted Successfully')
                res.redirect('/admin/customer')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/admin/customer') 
            }
        } catch (err) {
            req.flash('error',err)
            res.redirect('/admin/customer')
        }
    }

    static deleteCustomerPermanently = async(req,res) => {
        try {
            const data = await CustomerModel.findByIdAndDelete(req.params.id)

            if (data) {
                req.flash('succMsg','Customer Deleted Permanently')
                res.redirect('/admin/customer')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect('/admin/customer') 
            }
        } catch (err) {
            req.flash('error',err)
            res.redirect('/admin/customer')
        }
    }

}
module.exports = CustomerController