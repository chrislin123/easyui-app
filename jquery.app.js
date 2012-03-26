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
    var loaded = false;//初始化状态

    /**
     * layout初始化
     * @param target
     */
    function initLayout(target) {
        var jqTarget = $(target);
        var state = $.data(target, 'app');
        var opts = state.options;

        var center = $('<div/>').attr({'border':false, 'region':'center'}).css({'overflow':'hidden'}).appendTo(jqTarget);
        if (jqTarget.context.nodeName !== 'BODY')//非body对象，添加fit属性
            jqTarget.attr('fit', true);

        var region = {south:true, north:true, west:true, east:true};

        if (!region[opts.taskBlankPos])       //有效值验证
            opts.taskBlankPos = 'north';

        var taskBlank = $('<div/>').attr({'border':false, 'region':opts.taskBlankPos}).css({'overflow':'hidden'}).appendTo(jqTarget);
        if (opts.taskBlankPos == 'north' || opts.taskBlankPos == 'south') {
            taskBlank.css("height", 35);
        } else {
            taskBlank.css("width", 35);
        }
        jqTarget.layout();
    }

    /**
     * 初始化任务栏
     * @param target
     */
    function initTaskBlank(target) {

    }

    /**
     *初始化桌面
     * @param target
     */
    function initDeskTop(target) {

    }

    /**
     *初始化开始菜单
     * @param target
     */
    function initStartMenu(target) {

    }

    /**
     *初始化时间
     * @param target
     */
    function initCalendar(target) {

    }

    /**
     *初始化widget
     * @param target
     */
    function initWidget(target) {

    }

    /**
     * 第一步是初始化layout
     * 第二部初始化任务栏
     * 第三部初始化桌面
     * 第四步初始化开始菜单
     * 第五步初始化时间
     * 第六步初始化widget
     */
    var init = [
        {
            status:$.fn.app.defaults.lang.initLayout,
            handler:initLayout
        },
        {
            status:$.fn.app.defaults.lang.initTaskBlank,
            handler:initTaskBlank
        },
        {
            status:$.fn.app.defaults.lang.initDeskTop,
            handler:initDeskTop
        },
        {
            status:$.fn.app.defaults.lang.initStartMenu,
            handler:initStartMenu
        },
        {
            status:$.fn.app.defaults.lang.initCalendar,
            handler:initCalendar
        },
        {
            status:$.fn.app.defaults.lang.initWidget,
            handler:initWidget
        }
    ];

    function init(target, options) {
        var progress = $('<div/>').appendTo('body');
        for (var i in init) {
            var step = init[i];
            progress.progressbar({width:400, value:((i + 1) / init.length), text:step.status});
            step.handler.call(this, target);
        }
        progress.remove();
        loaded = true;
    }

    $.fn.app = function (options, params) {
        if (typeof options === 'string') {
            return this.methods[options].call(this, params);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'app');
            if (state) {
                options = $.extend(state.options, options);
                state.options = options;
            } else {
                options = $.extend({}, $.fn.app.defaults, $.fn.app.parseOptions, options);
                $.data(this, 'app', {
                    options:options
                });
            }

            init(this, options);
        });
    };

    $.fn.app.methods = {};

    $.fn.app.parseOptions = function () {
    };

    $.fn.app.defaults = {
        taskBlankPos:'north', //任务栏的位置（north|south|west|east）
        lang:{
            initLayout:"init layout",
            initTaskBlank:"init task blank",
            initDeskTop:"init desktop",
            initStartMenu:"init start menu",
            initCalendar:"init calendar",
            initWidget:"init widget"
        }
    };

    $.parser.plugins.push('app');
})(jQuery);