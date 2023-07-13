 const{ verifyOtp, register} = require('../services/user.service')
 const  {incr} = require('../models/limiter');
const client = require('../config/init_redis');

var that = module.exports = {
    register: async(req, res, next)=>{
        try{
            const {email} = req.body;
            const lastOtpTime = req.session.lastOtpTime;
            const {code, message} = await register({email, lastOtpTime})

            req.session.lastOtpTime = Date.now();

            return res.status(code).json({
                message: message
            })

        }catch(error){
            console.log(error);
            next(error);
        }
    },
    verifyOtp: async(req, res, next)=>{
        try{
            const { email, otp, username } = req.body;

        const result_verify = await verifyOtp({email, otp, username});

        return res.status(result_verify.code).json({
                message: result_verify.message
            })
        
           

        }catch(error){
            console.log(error);
            next(error);
        }
    },
    getTest: async(req, res, next)=>{
        try{
            // get ip request 
            // nếu chưa qua cổng proxy lấy cái thứ 2 nếu qua rồi ta lấy cái 1 
            const getIpUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log('du lieu print ra la: ' + req.headers['x-forwarded-for'] + '  '+ req.connection.remoteAddress);
            // ta sẽ vứt cái ip này vào cache để xem nó đã thực hiện request bao nhiêu lần rồi! 
           const numRequest = await incr(getIpUser)

           const limit = 10;
           const expire = 60;

           if(numRequest > limit){
            await client.expireAsync(getIpUser, expire); 
            return res.status(429).json({
            message: `Bạn đã vượt quá số lượng yêu cầu tối đa là ${limit} trong ${expire} giây. Vui lòng thử lại sau.`
           })
           }else{
            
             return res.status(200).json({
                message: [
                    {
                        id: 1,
                        name: 'nodejs'
                    }, {
                        id: 2,
                        name: 'java'
                    }
                ]
            })
           }

           

          



        }catch(error){
            console.log('lỗi gì: '+ error);
           next(error);
        }
    }
}