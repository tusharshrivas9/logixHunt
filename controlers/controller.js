const User = require("../models/user")
 require("dotenv").config()
const moment = require("moment")
const otpGenerator = require("otp-generator")
const accountSid = process.env.accountSid
const authToken = process.env.accountSid
const twilio = require('twilio')(accountSid,authToken);



// for home page
const home = async (req,res)=>{
try {
    res.status(200).json("welcome to home page")
} catch (error) {
    console.log("error in home",error);
}
}

// const register = async (req,res)=>{
//    try {
//     const {name,email,password,phone} = req.body
//     const userExist = await User.findOne({email})
//     if (userExist) {
//         res.status(400).json({msg:"email already exist"})
//     }

//     const userCreate = await User.create({name,email,password,phone})

//     console.log(userCreate);

//     res.status(200).json({userCreate,msg:"registered sucessfully"})
//    } catch (error) {
//     console.log("register error",error);
//    }
// }

// const check_login = async (req,res)=>{
//     try {
//         const {name,email,city,mobile_no,whatapp,gender,dob,profile_pic,addedon,update_on,otp_code,status} = req.body

//         const userExist = await User.findOne({mobile_no})

//         if (userExist) {
//             res.status(400).json({msg:"This phone no is already exist",userExist})
//         }

//         const userCreate = await User.create({name,email,city,mobile_no,whatapp,gender,dob,profile_pic,addedon,update_on,otp_code,status})

//         res.status(200).json({userCreate,msg:"registered sucessfully"})
//     } catch (error) {
//         console.log("error in check login",error);
//     }
// }
const check_login = async (req,res)=>{
    try {
        const {mobile_no} = req.body

        const userExist = await User.findOne({mobile_no})

        if (userExist) {
            res.status(400).json({msg:"This phone no is already exist",userExist})
        }

        const userCreate = await User.create({mobile_no})

        res.status(200).json({userCreate,msg:"registered sucessfully"})
    } catch (error) {
        console.log("error in check login",error);
        res.status(500).json({ msg: "Server error" });
    }
}
const send_otp = async (req, res) => {
    try {
        const { mobile_no } = req.body;

        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        const user = await User.findOneAndUpdate(
            { mobile_no },
            { $set: { otp_code: otp, otpExpiration: moment().add(5, 'minutes') } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found for the provided mobile number" });
        }

        
        // Send OTP to the user's mobile number via Twilio SMS
        twilio.messages
            .create({
                body: `Your OTP is: ${otp}`,
                from: process.env.tphone, // Replace with your Twilio phone number
                to: user.mobile_no // Assuming user.mobile_no holds the user's phone number
            })
            .then(message => {
                console.log(message.sid);
                res.status(200).json({ msg: "OTP sent successfully", user });
            })
            .catch(error => {
                console.error("Error sending OTP:", error);
                res.status(500).json({ msg: "Error sending OTP" });
            });
    } catch (error) {
        console.error("Error in send_otp:", error);
        res.status(500).json({ msg: "Server error" });
    }
};



const verify_otp = async (req,res)=>{
    try {
        const { mobile_no, otp } = req.body;

        // Find the user by mobile number
        const user = await User.findOne({ mobile_no });

        // Check if user and OTP exist and are not expired
        if (user && user.otp_code === otp && moment().isBefore(user.otpExpiration)) {
            // Clear the OTP and expiration after successful verification
            await User.updateOne(
                { mobile_no },
                { $unset: { otp_code: 1, otpExpiration: 1 } }
            );

            res.status(200).json({ msg: "OTP verified successfully" });
        } else {
            res.status(400).json({ msg: "Invalid or expired OTP" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ msg: "Error verifying OTP" });
    }
};

const teacher_profile = async ()=>{
    try {
        const teacherId = req.params.teacherId

       
        const teacherProfile = await TeacherProfile.findById(teacherId);

        if (!teacherProfile) {
            return res.status(404).json({ msg: "Teacher profile not found" });
        }

        
        if (req.method === 'GET') {
            // Return the teacher profile details
            return res.status(200).json({ teacherProfile });
        } else if (req.method === 'PUT') {
            // Update profile details
            // Example: Update teacher's name
            const { name } = req.body;
            teacherProfile.name = name;
            await teacherProfile.save();

            return res.status(200).json({ msg: "Teacher profile updated successfully", teacherProfile });
        } else if (req.method === 'DELETE') {
           
            await teacherProfile.remove();

            return res.status(200).json({ msg: "Teacher profile deleted successfully" });
        } else {
            return res.status(400).json({ msg: "Invalid request" });
        }
    } catch (error) {
        console.error("Error in teacher_profile:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

const update_profile = async ()=>{

}




module.exports = {home,check_login,send_otp,verify_otp,teacher_profile,update_profile}