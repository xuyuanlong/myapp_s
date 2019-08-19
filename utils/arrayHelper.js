var arrayHelper = {};

Array.prototype.find = function(val, key) {
    if (key) {
        for (var i = 0; i < this.length; ++i) {
            if (this[i][key] == val) {
                return i;
            }
        }
    } else {
        for (var i = 0; i < this.length; ++i) {
            if (this[i] == val) {
                return i;
            }
        }
    }
    return -1;
};

Array.prototype.unique = function() {
    var n = {},
        r = []; //n为hash表，r为临时数组
    for (var i = 0; i < this.length; i++) //遍历当前数组
    {
        if (!n[this[i]]) //如果hash表中没有当前项
        {
            n[this[i]] = true; //存入hash表
            r.push(this[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
};

/*
 *  方法:Array.remove(dx)
 *  功能:根据元素位置值删除数组元素.
 *  参数:元素值
 *  返回:在原数组上修改数组
 *  作者：pxp
 */
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};

Array.prototype.each = function(callback) {
    if (!this) {
        return false;
    }
    var arr = this,
        len = arr.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            callback && callback.call(this, i, arr[i]);
        }
    }
};

Array.prototype.numbers = function(val, key) {
    var numbers = 0;
    if (key) {
        for (var i = 0; i < this.length; ++i) {
            if (this[i][key] == val) {
                numbers++;
            }
        }
    } else {
        for (var i = 0; i < this.length; ++i) {
            if (this[i] == val) {
                numbers++;
            }
        }
    }
    return numbers;
};

module.exports = arrayHelper;