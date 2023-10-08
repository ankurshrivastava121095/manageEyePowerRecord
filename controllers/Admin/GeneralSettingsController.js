const UserModel = require("../../models/User");

class GeneralSettingsController {

    static updateProfile = async(req,res) => {
        try{
            const {name, firmName, userName, email, role, _id} = req.data
            const userData = {name, firmName, userName, email, role, _id}

            res.render('admin/generalSettings/updateProfile',{userData, succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        }catch(err){
            console.log(err);
        }
    }

    static updateUserProfile = async(req,res) => {
        try{
            // console.log(req.body);
            const { name, firmName, userName } = req.body

            const data = await UserModel.findByIdAndUpdate(req.params.id, {
                name : name,
                firmName : firmName,
                userName : userName,
            })
            const dataSaved = await data.save()

            if (dataSaved) {
                req.flash('succMsg','Your Profile Updated Successfully')
                res.redirect('/admin/updateProfile')
            } else {
                req.flash('error','Internal Server Error')
                res.redirect(`/admin/updateProfile`) 
            }
        }catch(err){
            req.flash('error',err)
            res.redirect(`/admin/updateProfile`)
        }
    }

}
module.exports = GeneralSettingsController