const OTPGenerator = require('otp-generator');
//khai bao model
const User = require('../models/user.models');

const OTP = require('../models/otp.model');

const moment = require('moment');

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

        try{
           const limit = 5;
          //.toISOString() return a date as a string 
          const currentDate = new Date().toISOString().slice(0, 10);
        let result = await User.handleEmail(email)
        .then( (data)=>{
            return data
        })
        .catch((err)=>{
            return err
        } )

        // neu nhu co du lieu roi thi return tra ve!
        if(result.status == 0){
            return result
        }

        // neu chua co email trong user cho phep gui OTP
        const otp_result = await OTP.otp_count({email})
                            .then( (data)=>{
                                return data
                            })
                            .catch(err=>{
                                return err
                            })

        if(otp_result == null){
            return {
                code: 500,
                message: "something went wrong’",
                status: 0
            }
        }else{
            // neu nhu email ko co trong bang otp_count

            // neu lay du lieu trong bang otp_count ko co 
    if(otp_result.length === 0){
        
              let insert_otp_count = await OTP.add_otp_count({email})
              if(insert_otp_count == null){
                return {
                    code: 500,
                    message: "something went wrong’",
                    status: 0
                }
              }
              // generate otp 
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
              // neu nhu email da co trong bang otp_count
    }else{
                const otpCount = otp_result[0];
                //var currentDate = new Date().toISOString().slice(0, 10);
                // otpCount.date.toISOString().slice(0, 10)
                var isoString = moment(currentDate).utc().format(); 

                if(isoString.slice(0, 10) !== otpCount.date.toISOString().slice(0, 10)){

                    console.log('chay vao day khi chua co du lieu trong otp_count!')
                   let updateOtpCount = await OTP.update_otp_count(email)
                    .then(data=>{
                        return data
                    })
                    .catch(err=>{
                        return err
                    })

                    if(updateOtpCount == null){
                        return{
                            code: 500,
                            message: "something went wrong’",
                            status: 0
                        }
                    }
                    // check neu nhu ma co lasOtpTime va no < 60s no se di vao day 
                    // send otp
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
                    
        
    
    // neu so sanh 2 ngay van dang trung nhau 
    }else{

                    console.log('di duoc vao day ko '+ otpCount.count)
                    if(otpCount.count >= limit){
                        return{
                            code: 429,
                            message: "you have reached the maximum number of OTP requests for today",
                            status: 0
                        }
                    }else{
                        // update neu otp cha dat den limit
                        let update_count_otp = await OTP.update_otp_count(email, otpCount.count + 1);
                        if(update_count_otp == null){
                            return{
                                code: 500,
                                message: "something went wrong’",
                                status: 0
                            }
                        }
                        // check neu nhu ma co lasOtpTime va no < 60s no se di vao day 
                         // send otp
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

        
    }

}