const OTPGenerator = require('otp-generator');
//khai bao model
const User = require('../models/user.models');

const OTP = require('../models/otp.model');

//khai bao service otp
const { validOtp, insertOtp } = require('./otp.service')

var that = module.exports = {
    verifyOtp: async({email, otp, username})=>{
        try{
            let otpHolder = await OTP.findEmail_otp({email})
                                    .then( (data)=>{
                                        return data
                                    } )
                                    .catch( (err)=>{
                                        return err
                                    } )

            if(otpHolder.status == 0){
                return otpHolder;
            }

            let hashOtpOnDB = otpHolder.message.otp;

            const isMatch = await validOtp({otp, hashOtpOnDB});

            if(isMatch.isValid == false){
                return isMatch
            }

            if(isMatch.isValid && email == otpHolder.message.email){
                // create user on server:
                const user = await User.createUser({username, email})
                                .then( (data)=>{
                                    return data
                                } )
                                .catch( (error)=>{
                                    return error
                                } )
                // if create success
                if(user.status != 0){
                  let delete_Otp_all_inDB = await OTP.deleteAll({email})

                  if(delete_Otp_all_inDB.status == 1){
                    return {
                            code: 201,
                            message: user.message,
                            status: 1
                        }
                  }else{
                    return delete_Otp_all_inDB
                  }
                }else{
                    return user
                }

            }

        }catch(error){
            console.log(error);
            return {
                code: 500,
                message: "error! handle has been wrong logic",
                status: 0
            }
        }
    },
    register: async ({email, lastOtpTime})=>{
     let result = await User.handleEmail(email)
        .then( (data)=>{
            return data
        })
        .catch((err)=>{
            console.log("tai khoan chua co trong server tiep tuc thuc hien cac buoc khac")
        } )

        if(result.status == 0){
            return result
        }

        // check neu nhu ma co lasOtpTime va no < 60s no se di vao day 
        if(lastOtpTime && Date.now() - lastOtpTime < 60000){
            return {
                code: 429,
                message: "please wait for a minute before requesting OTP again!",
                status: 0
            }
        }

        const otp = OTPGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })

        let {message, code, status} = await insertOtp({email, otp})

        console.log("du lieu co di ra duoc day ko: " + message + code + status );

        return {
            code: code,
            message: message,
            status: status
        }
    }
}