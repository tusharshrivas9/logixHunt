const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")



const userSchema = mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    city:{
        type:String,
        
    },
    mobile_no:{
        type:Number,
        required:true
    },
    whatapp:{
        type:Number,
        
    },
    gender:{
        type:String,
        
    },
    dob:{
        type:String,
        
    },
    profile_pic:{
        type:String,
        
    },
    addedon:{
        type:String,
        
    },
    update_on:{
        type:String,
        
    },
    otp_code:{
        type:String,
        
    },
    status:{
        type:Boolean,
        
    },
  

},{
    timeStamp:true
})

// userSchema.pre("save",async function (next) {
//     const user = this

//     if (!user.isModified("password")) {
//        next()
//     }
//     try {
//         const salt = await bcrypt.genSalt(10)
//             const hashPassword = await bcrypt.hash(user.password,salt)
//             user.password = hashPassword
        
//     } catch (error) {
//         console.log("error",error);
//     }
// })


const User = mongoose.model("User",userSchema)
module.exports = User