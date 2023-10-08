const mongoose = require('mongoose')
const localUrl = 'mongodb://0.0.0.0:27017/ophthalmologistDB'
const liveUrl = 'mongodb+srv://ankurshrivastava121095:CKsobRn7k0SG3j3g@cluster0.4nhcmmj.mongodb.net/manageEyePowerRecord?retryWrites=true&w=majority'

const connectDB = () => {
    return mongoose.connect(liveUrl)
    .then(() => {
        console.log("Connection Successfully !")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connectDB