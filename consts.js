const CONSTS = {
    DEBUG: true,
    APP: {
        PORT: this.DEBUG ? 8775 : 80,
        SSLPORT: this.DEBUG ? 8443 : 443,
        STATICPATH: '../chare_pc/',
        LOGPATH: '../logs/',
        SOURCEDIST: 'upload/',
        UPLOADURL: 'http://123.57.8.173:8775/upload/',
        COUNT: 10,
    },
    DATABASE: {
        NAME: 'myapp',
        HOST: this.DEBUG ? '127.0.0.1':'39.106.29.18',
        PORT: '27017',
        USER: 'myapp',
        PASS: 'myapp',
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
