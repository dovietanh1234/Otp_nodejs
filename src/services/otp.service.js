
const OTP = require('../models/otp.model');
const bcrypt = require('bcrypt');

var that = module.exports = {

    validOtp: async({ otp, hashOtpOnDB})=>{
        try{
            console.log("ma otp:" + otp);
            console.log("ma hash" + hashOtpOnDB);
            const isValid = await bcrypt.compare(otp, hashOtpOnDB)
            console.log("ko ra duoc du lieu" + isValid)
            if(isValid == false){
                return {
                    code: 403,
                    message: 'your otp is not match! please try later!',
                    isValid: false
                }
            }else{
                return {
                code: 200,
                message: 'otp match!!',
                isValid: true
            }
            }
        }catch(error){
            console.log(error);
            return {
                code: 500,
                message: 'error! server fail *_* please try later',
                isValid: false
            }
        }
    },
    insertOtp: async({email, otp})=>{
        try{
            const salt = await bcrypt.genSalt(10);
            console.log(otp);
            const hashOtp = await bcrypt.hash(otp, salt);
            let a;
             await OTP.handleOTP({email, hashOtp})
             .then( (data)=>{
                a = data;
             })
             .catch((error)=>{
                a = error;
             })
            return a

        }catch(eror){
            return {
                code: 500,
                message: 'error! server fail *_* please try later',
                status: 0
            }
        }
    }
}