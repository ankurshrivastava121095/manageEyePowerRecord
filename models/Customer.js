const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required : true
    },
    customerData : {
        type : String,
        required : true,
        unique: true
    },
    isDeleted : {
        type : Number,
        required : true,
        default: 0,
    },
},{ timestamps : true })

const CustomerModel = mongoose.model('customers',CustomerSchema)

module.exports = CustomerModel