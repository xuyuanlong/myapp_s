var mongoose = require('mongoose')

let url = "mongodb://localhost:27017/myapp";
let options = {
    user: 'myapp',
    pass: 'myapp',
    useNewUrlParser: true 
}
/**
 * 连接
 */
mongoose.connect(url,options,function(err){
    if(err) {
        console.log('Mongoose connection error: ' + err);  
    } else {
        console.log('Mongoose connection to ' + url);  
    }
});

/**
 * 连接断开
 */
// mongoose.connection.on('disconnected', function () {    
//     console.log('Mongoose connection disconnected');  
// });    

module.exports = mongoose;