// const redis = require('redis');

// const client = redis.createClient({
//     legacyMode: true,
//     password: 'c7MQnKWXSQeoB3wFEn1rmdkLWRfj14WD',
//     socket: {
//         host: 'redis-15919.c292.ap-southeast-1-1.ec2.cloud.redislabs.com',
//         port: 15919
//     }
// });

// client.connect().then(() => {
//     console.log('Connected to Redis');
// }).catch((err) => {
//     console.log(err.message);
// })

// client.ping((err,pong)=>{
//     console.log(pong);
// })

// client.on("error",function(error){
//     console.log(error);
// })
// client.on("connect",function(error){
//     console.log("connected");
// })
// client.on("ready",function(error){
//     console.log("Redis to ready");
// })

// module.exports = client;
