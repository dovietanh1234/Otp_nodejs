module.exports = function(app, sessionMiddleware){

const {register, verifyOtp, getTest} = require('../controllers/user.controller');

    app.get('/', getTest);
    app.post('/sendEmail/otp', sessionMiddleware, register);
    app.post('/sendEmail/verify', verifyOtp);
}