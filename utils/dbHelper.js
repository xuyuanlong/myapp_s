var EventProxy = require('eventproxy');

var logger = require('../models/logger');
var resultJson = require('../result-json');
var arrayHelper = require('./arrayHelper');

var dbHelper = {
    list: function(table, opt, sort, start, count, res, cb) {
        var proxy = new EventProxy();
        proxy.all('results', 'count', function(results, count) {
            var result = {
                results: results,
                count: count,
            };
            if (cb) {
                cb(result);
            } else {
                return res.send(resultJson(0, result));
            }
        })

        table.find(opt).skip(start).limit(count).sort(sort).exec(function(err, items) {
            if (err) { 
                logger.error(err);
                return res.send(resultJson(2));
            }
            proxy.emit('results', items);
        });

        table.find(opt).count(function(err, num) {
            if (err) {
                logger.error(err);
                return res.send(resultJson(2));
            }
            proxy.emit('count', num);
        });
    },

    upsert: function(table, item, res, cbNew, cbUpdate) {
        if (item._id) {
            var _id = item._id;
            delete item._id;
            table.update({
                _id: _id
            }, {
                $set: item
            }).exec(function(err) {
                if (err) {
                    logger.error(err);
                    return res.send(resultJson(2));
                }
                if (cbUpdate) {
                    cbUpdate();
                } else {
                    return res.send(resultJson(0,item));
                }
            });
        } else {
            item.create = new Date();
            new table(item).save(function(err, item) {
                if (err) {
                    logger.error(err);
                    return res.send(resultJson(2));
                }
                if (cbNew) {
                    cbNew(item);
                } else {
                    return res.send(resultJson(0, item));
                }
            });
        }
    },

    detail: function(table, _id, res, cb) {
        if(!_id) {
            return res.send(resultJson(3));
        }

        table.findById(_id, function(err, item) {
            if (err || !item) {
                logger.error(err);
                return res.send(resultJson(2));
            }

            if (cb) {
                cb(item);   
            }else {
                res.send(resultJson(0, item));
            }
        });
    },

    remove: function(table, _id, res) {
        if(!_id) {
            return res.send(resultJson(3));
        }

        table.remove({
            _id: _id
        }, function(err) {
            if (err) {
                logger.error(err);
                res.send(resultJson(2));
            } else {
                res.send(resultJson(0));
            }
        });
    },

    findOne: function(table, opt, sort, res) {
        table.findOne(opt).sort(sort).exec(function(err, item) {
            if (err) {
                return res.send(resultJson(2));
            }

            if (!item) {
                item = [];
            }
            return res.send(resultJson(0, item));
        });
    },

    listAll: function(table, opt, sort, res, cb) {
        logger.debug('listAll opt:', opt);
        table.find(opt).sort(sort).exec(function(err, items) {
            if (err) { 
                logger.error(err);
                return res.send(resultJson(2));
            }
            if (cb) {
                cb(items);
            } else {
                return res.send(resultJson(items));
            }
        });
    },
};

module.exports = dbHelper;