const redis = require('redis');
// tạo một đối tượng cấu hình thông số cho nó! 
const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
})

// check xem redis đã connect tời bể chứa chưa sử dụng:
client.on('connect', ()=>{
    console.log("redis connected" );
})
module.exports = client;