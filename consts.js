var DEBUG = false; //正式服务器设置为false，测试服务器（本地起服务）设置为true

var CONSTS = {
    APP: {
        PORT: DEBUG ? 8775 : 80,
        SSLPORT: DEBUG ? 8443 : 443,
        STATICPATH: '../chare_pc/',
        LOGPATH: '../logs/',
        SOURCEDIST: 'upload/',
        TIMEOUT: '2019-4-1 00:00:00',
        UPLOADURL: 'http://123.57.8.173:8775/upload/',
        COUNT: 10,
        TITLE: 'chare',
    },
    DATABASE: {
        NAME: 'chare',
        HOST: DEBUG ? '39.106.29.18':'127.0.0.1',
        PORT: '39218',
        USER: '#deiI15cei#1',
        PASS: '124rQDD$q3D!',
        AUTORECONNECT: true,
        POOLSIZE: 10,
    },
    UPLOAD: {
        PATH: '../chare_pc/upload/',
        BASE: 'http://chare.touchit.com.cn/upload/',
    }, 
    COOKIE: {
        COOKIE_CODE: 'SESSION_TOKEN_CODE',
        MAXAGE: 365 * 24 * 60 * 1000 , //cookie超时时间 分钟*1000
    },
    //用户类型
    UTYPE: { 
        SUPERADMIN: 0, //平台管理员
        ADMIN: 1, //管理员
        USER: 2,  //普通用户
    }
};  

module.exports = CONSTS;
