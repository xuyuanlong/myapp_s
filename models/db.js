const mongoose = require('mongoose')
const CONST = require('../consts');
const logger = require('./logger')
const url = `mongodb://${CONST.DATABASE.HOST}:${CONST.DATABASE.PORT}/${CONST.DATABASE.NAME}`

let options = {
    user: CONST.DATABASE.USER,
    pass: CONST.DATABASE.USER,
    useNewUrlParser: true 
}
/**
 * 连接
 */
mongoose.connect(url,options,function(err){
    if(err) {
        logger.error('Mongoose connection error: ' + err);  
    } else {
        logger.info('Mongoose connection to ' + url);  
    }
});

/**
 * 连接断开
 */
// mongoose.connection.on('disconnected', function () {    
//     console.log('Mongoose connection disconnected');  
// });    

module.exports = mongoose;