const client = require('../config/init_redis');

const incr = async key =>{
    try {
        const result = await client.incr(key);
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    incr
}
