const redis =  require("redis");
const promisify = require("util");

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
});

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

//HOW TO USE
//await GET_ASYNC('phones')
//await SET_ASYNC('phones', JSON.stringify(response.data), 'EX', 5);  save to redis key phones with value data with expiration of 5s