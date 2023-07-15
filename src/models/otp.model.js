const db = require('../config/connect');

const OTP = function(otp){
    this.emai = otp.email;
    this.otp = otp.otp;
}


OTP.handleOTP = ({email, hashOtp})=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let query = 'INSERT INTO otp(email, otp) VALUES (?, ?)';
            db.query(query, [email, hashOtp], (err, data)=>{
                if(err){
                    reject({
                        code: 500,
                        message: "can not insert into database because something wrong with server",
                        status: 0
                    }) 
                }
                resolve({
                        code: 203,
                        message: "insert success",
                        status: 1
                })
            })
        }catch(error){
            reject({
                code: 500,
                message: "error! server fail *_* please try later",
                status: 0,
              });
        }
    })
}

OTP.findEmail_otp = ({email})=>{

    return new Promise( async(resolve, reject)=>{
        // khi send nhieu otp ta se lay otp cuoi cung de verify:
    let query = 'SELECT * FROM otp WHERE email = ? ORDER BY time DESC limit 1';
    db.query(query, [email], (err, data)=>{
        if(err){
            reject({
                code: 500,
                message: " Error! something wrong with server OR database is not found",
                status: 0
            })
        }
        
        if(data.length == 0){
            reject({
                code: 403,
                message: " Error! email is not match with otp ",
                status: 0
            })
        }else{
            resolve({
            code: 200,
            message: data[0],
            status: 1
        })
        }
        
    })
    } ) 

    
}

OTP.deleteAll = ({email})=>{

    return new Promise( async(resolve, reject)=>{

        let query = 'DELETE FROM otp WHERE email = ?'

        db.query(query, [email], (err, data)=>{
            if(err){
                return reject({
                    code: 500,
                    message: " Error! something wrong with server",
                    status: 0
                })
            }
            return resolve({
                code: 204,
                message: "delete successfully",
                status: 1
            })
        })

    })
}

OTP.otp_count = ({email})=>{
    return new Promise( async(resolve, reject)=>{
         let query = 'SELECT * FROM otp_count WHERE email = ?';

    db.query(query, [email], (err, data)=>{
        if(err){
             return reject(null);
        }
        return resolve(data);
    })
    } )
}

OTP.add_otp_count = ({email})=>{
    return new Promise( (resolve, reject)=>{
//        var currentDate = new Date().toISOString().slice(0, 10);

         let query = 'INSERT INTO otp_count (email, count) VALUES (?, ?)';
   db.query(query, [email, 1], (err, data)=>{
    if(err){
       return reject(null);
    }
        return resolve('inserting successfully');
   })
    } )
  
}

OTP.update_otp_count = (email, value = 1)=>{
    console.log('parameter default ' + value);
    return new Promise( (resolve, reject)=>{
         let query = 'UPDATE otp_count SET count=? WHERE email = ?';
   db.query(query, [value, email], (err, data)=>{
    if(err){
       return reject(null);
    }
        return resolve('inserting successfully');
   })
    } )
  
}


module.exports = OTP