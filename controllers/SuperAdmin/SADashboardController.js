const UserModel = require("../../models/User")

class SADashboardController {

    static dashboard = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            const totalClients = await UserModel.find().count()
            const totalActiveClients = await UserModel.find({ status: 'active' }).count()
            const totalInactiveClients = await UserModel.find({ status: 'inactive' }).count()
            const deletedClients = await UserModel.find({ isDeleted: 1 }).count()

            const counts = { totalClients, totalActiveClients, totalInactiveClients, deletedClients }

            res.render('superAdmin/dashboard/index',{userData, counts, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

}
module.exports = SADashboardController