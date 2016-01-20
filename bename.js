
n (window, undefined) {
    // 随机数
    var rd = function (l) {
        return Math.floor(Math.random() * (l || 10));
    };

    // 毫无理由的随机数
    // Math.random() 随机数每个数的区间段还是蛮平均的
    var rd2 = function () {
        var rds = Math.random().toString().replace('.', '');
        var r1 = rd(15);
        if (r1 >= rds.length) {
            r1 = rds.length - 5;
        }

        return parseInt(rds.substr(r1, 1), 10);
    }

    var isArray = Array.isArray;

    var isObject = function (obj) {
        return obj !== null && typeof obj === 'object';
    };

    var forEach = function (obj, fn) {
        var rst;
        if (isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
                rst = fn.call(null, obj[i], i);
                if ('__BREAK__' === rst) {
                    break;
                }
            }
        } else {
            for (var key in obj) if (obj.hasOwnProperty(key)) {
                rst = fn.call(null, obj[key], key);
                if ('__BREAK__' === rst) {
                    break;
                }
            }
        }
    }

    /**
     * 对象(数组)浅拷贝
     * @param obj
     * @returns {*}
     * @interface isArray, forEach
     */
    var copy = function (obj) {
        var target = isArray(obj) ? [] : {};

        forEach(obj, function (v, k) {
            target[k] = v;
        });

        return target;
    };

    // 灰常强大的map
    var map = function (obj, fn, oa) {
        var o = oa, rst;

        var isRstArray = isArray(oa);

        forEach(obj, function (val, key) {
            rst = fn.call(null, obj[key], key);
            if (isRstArray) {
                o.push(rst);
            } else {
                o[rst.__key__ || key] = rst.__val__ == null ? rst : rst.__val__;
            }
        })

        return o;
    };

    // 取名主程序
    // 将名字放在蛊皿里, 喂养随机数(每次10个, 懒得做个数计算)
    // loop次喂养为一轮, 淘汰最差的, 最终决出最优者
    // 最优者 与 总轮数可能会的喂养的最佳者 为同一个就是最后的 胜利者
    // 如果不是, 则重新养蛊

    var bename_ = function (sourceObj, nameObj, loop) {

        //console.group('养姓名蛊中...');

        var names = map(nameObj, function (val, key) {
            return key;
        }, []);

        var sourcenNames = map(sourceObj, function (count, name) {
            return {
                name: name,
                count: count
            }
        }, []).sort(function (a, b) {
            return a.count > b.count ? -1 : 1;
        });

        if (names.length < 2) {

            var showOrders = map(sourcenNames, function (o) {
                return o.name + ':' + o.count;
            }, []);

            //console.table(sourcenNames)

            localStorage.setItem('BENAME', parseInt(localStorage.getItem('BENAME', 0), 10) + 1);

            console.debug(parseInt(localStorage.getItem('BENAME', 0), 10), names[0], sourcenNames[0].name, showOrders);

            return names[0] === sourcenNames[0].name ? names[0] : (function () {
                sourceObj = map(sourceObj, function () {
                    return 0;
                }, {});

                return bename_(sourceObj, copy(sourceObj), loop);
            })();
        }

        // 对 sourcenNames 进行随机排序, 打乱顺序
        sourcenNames.sort(function () {
            return Math.random() > .5 ? -1 : 1;
        });

        for (var i = 0; i < loop; i++) {
            var ind = rd2();
            var rd66 = rd(ind * 10);
            var name = sourcenNames[ind].name;

            if (nameObj[name] != null) {
                nameObj[name] = nameObj[name] + rd66;
            }
            sourceObj[name] = sourceObj[name] + rd66;

        }

        var sortNames = map(nameObj, function (count, name) {
            return {
                name: name,
                count: count
            }
        }, []).sort(function (a, b) {
            return a.count > b.count ? -1 : 1;
        });

        //console.debug(  map( copy(sortNames), function(o){
        //    return o.name + ':' + o.count;
        //}, []) );
        //
        //console.groupEnd();

        // 去除数组最少一项
        sortNames.pop();

        nameObj = map(sortNames, function (o, i) {
            return {
                '__key__': o.name,
                '__val__': 0
            }
        }, {});

        return bename_(sourceObj, nameObj, loop);
    };

    /**
     * [bename description]
     * @param  {[type]} nameObj [名字对象]
     * @param  {[type]} loop    [description]
     * @return {[type]}         [description]
     */
    window.bename = function (nameObj, loop) {
        return bename_(copy(nameObj), nameObj, loop);
    };

})(window);

// 不限个数, 少于等于10 为佳
var nameObj = {
    '林逸': 0,
    '林尧': 0,
    '林霄': 0,
    '林放': 0,
    '林纾': 0,
    '林恒': 0,
    '林初': 0,
    '林峯': 0,
    '林野': 0,
    '林素': 0
};

// loop 习惯用孩子的出生年月最为每轮叠加次数
// lucktime 孩子抓阄或随机给出, 经验为 30 以下值比价容易算出
// 整体就是 随机呀随机``````

var lucktime = 40;

do {
    localStorage.setItem('BENAME', 0);

    //var name = bename(nameObj, 20151219);
    var name = bename(nameObj, 99);

    if (localStorage.getItem('BENAME') != lucktime) {
        console.info('米少可能的名字', name);
    } else {
        console.info('米少最终取名', name);
    }

} while (localStorage.getItem('BENAME') != lucktime);




