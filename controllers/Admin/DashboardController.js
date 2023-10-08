const CustomerModel = require("../../models/Customer")

class DashboardController {

    static dashboard = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            const totalCustomers = await CustomerModel.find({ admin: _id }).count()
            const temporaryDeletedCustomers = await CustomerModel.find({ admin: _id, isDeleted: 1 }).count()

            const counts = { totalCustomers, temporaryDeletedCustomers }

            res.render('admin/dashboard/index',{userData, counts, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

}
module.exports = DashboardController