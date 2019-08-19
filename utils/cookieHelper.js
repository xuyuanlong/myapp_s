var cookie = require('cookie');
var utilsHelper = require('../utils/utilsHelper');
var CONSTS = require('../consts'); 
var User = require('../models/User');
var logger = require('../models/logger');

var cookieHelper = {
	setCookie : function(id,res) {
		var token = utilsHelper.MD5('' + id);
		var set = {						
			token: token,
		};

		User.update({
			_id: id
		}, {
			$set: set
		}, function(err) {
			logger.error('err', err);
		})
		
		var cookies = [cookie.serialize(CONSTS.COOKIE.COOKIE_CODE, token, {
			maxAge: CONSTS.COOKIE.MAXAGE,
			path: '/'
		})];
		res.setHeader('Set-cookie', cookies);
	},
	clearCookie: function(res) {
		var cookies = [cookie.serialize(CONSTS.COOKIE.COOKIE_CODE, '', {
			maxAge: CONSTS.COOKIE.MAXAGE,
			path: '/'
		})];
		res.setHeader('Set-cookie', cookies);
	}
};

module.exports = cookieHelper;