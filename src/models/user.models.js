const db = require('../config/connect');

const User = function(user){
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.isAdmin = user.isAdmin;
    this.phoneNumber = user.phoneNumber;
}

User.handleEmail = (email)=>{
    return new Promise( async(resolve, reject)=>{

        let query = 'SELECT users.name FROM users WHERE email = ?';
        db.query(query, [email], (err, data)=>{
            if(err){
                return reject({
                    code: 500,
                    message: "error! something wrong with server!",
                    status: 0
                })
            }

            if(data.length == 0){
                return resolve({
                    code: 200,
                    message: "value not found",
                    code: 1
                })
            }

            return resolve({
                code: 403,
                message: "email was exist!",
                status: 0
            });
        })

    } )
    
}

User.createUser = ({username, email})=>{

    return new Promise( async(resolve, reject)=>{

        let query = 'INSERT INTO users(name, email) VALUES(?, ?)';

        db.query(query, [username, email], (err, data)=>{
            if(err){
                return reject({
                    code: 500,
                    message: "error! server something crash please try again",
                    status: 0
                })
            }
    
            return resolve({
                code: 203,
                message: "create account success!",
                status: 1
            })
        })

    } )


}

module.exports = User;