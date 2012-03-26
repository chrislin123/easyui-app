/**
 * Created by ____′↘夏悸，Universe，風亦飛 
 * User: ____′↘夏悸
 * Date: 12-3-26
 * 这个是一个jQuery Easyui的的桌面扩展
 * 讨论学习群：
 *    142872541（一）
 *    47729185（二）
 *    70168958（500人超级群）
 *    腾讯微博群号：83952631
 *    社区： http://bbs.btboys.com
 * version: 0.1
 */
(function ($) {
    var loaded = false;
    /**
     * 第一步是初始化layout
     * 第二部初始化任务栏
     * 第三部初始化桌面
     * 第四步初始化开始菜单
     * 第五步初始化时间
     * 第五步初始化widget
     */
    var init = [{
        status : '桌面',
        handler : function () {}
    }, {
        status : '开始菜单',
        handler : function () {}
    }, {
        status : '日历',
        handler : function () {}
    }, {
        status : '加载数据',
        handler : function () {}
    }
    ];

    function init(target, params) {
        var opt = $.data(target, 'app').options;
        for (var i in init) {
            var step = init[i];
            console.info(step.status);
            step.handler.call();
        }
        loaded = true;
    }

    $.fn.app = function (opt, params) {};
    $.fn.app.methods = {};
    $.fn.app.parseOptions = function () {};
    $.fn.app.defaults = {};
    $.parser.plugins.push('app');
})(jQuery);