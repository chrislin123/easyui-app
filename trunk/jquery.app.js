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
    var loaded = false; //初始化状态

    /**
     * layout初始化
     * @param target
     */
    function initLayout(target) {
        var jqTarget = $(target);
        var state = $.data(target, 'app');
        var opts = state.options;

        var center = $('<div/>').attr({
            'border' : false,
            'region' : 'center'
        }).css({
                overflow : 'hidden'
            }).appendTo(jqTarget);
        //墙纸设置
        if (opts.wallpaper) {
            center.css('background', 'url("' + opts.wallpaper + '") fixed no-repeat center');
        }
        if (jqTarget.context.nodeName !== 'BODY') //非body对象，添加fit属性
            jqTarget.attr('fit', true);

        var region = {
            south : true,
            north : true,
            west : true,
            east : true
        };
        if (!region[opts.taskBlankPos]) //有效值验证
            opts.taskBlankPos = 'south';

        var taskBlank = $('<div/>').attr({
            'border' : false,
            'region' : opts.taskBlankPos
        }).css({
                overflow : 'hidden'
            }).appendTo(jqTarget);
        if (opts.taskBlankPos == 'north' || opts.taskBlankPos == 'south') {
            taskBlank.css("height", 35);
        } else {
            taskBlank.css("width", 35);
        }
        //执行layout实例
        jqTarget.layout();
    }

    /**
     * 初始化任务栏
     * @param target
     */
    function initTaskBlank(target) {}

    /**
     *初始化桌面
     * @param target
     */
    function initDeskTop(target) {}

    /**
     *初始化开始菜单
     * @param target
     */
    function initStartMenu(target) {}

    /**
     *初始化时间
     * @param target
     */
    function initCalendar(target) {}

    /**
     *初始化widget
     * @param target
     */
    function initWidget(target) {}

    /**
     * 第一步是初始化layout
     * 第二部初始化任务栏
     * 第三部初始化桌面
     * 第四步初始化开始菜单
     * 第五步初始化时间
     * 第六步初始化widget
     */
    var initMethods = [initLayout, initTaskBlank, initDeskTop, initStartMenu, initCalendar, initWidget];

    /**
     * 初始化
     * @param target
     * @param options
     */
    function init(target, options) {
        if (loaded)
            return;

        $('body').attr('oncontextmenu', 'return false'); //禁用全局右键菜单

        var progress = $.messager.progress({ //实例化进度条
            title : options.lang.progress.title,
            msg : options.lang.progress.msg,
            interval : null
        });

        var progressBar = $.messager.progress('bar'); //获取进度条实例

        for (var i in initMethods) {
            var step = initMethods[i];
            progressBar.progressbar({
                text : options.lang[step.name]
            }).progressbar('setValue', ((parseInt(i) + 1) / initMethods.length) * 100);
            step.call(this, target);
        }
        $.messager.progress('close');
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
                    options : options
                });
            }

            init(this, options);
        });
    };

    $.fn.app.methods = {};

    $.fn.app.parseOptions = function () {};

    $.fn.app.defaults = {
        taskBlankPos : 'south', //任务栏的位置（north|south|west|east）
        wallpaper : 'wallpaper.jpg',
        lang : { //国际化
            initLayout : "init layout",
            initTaskBlank : "init task blank",
            initDeskTop : "init desktop",
            initStartMenu : "init start menu",
            initCalendar : "init calendar",
            initWidget : "init widget",
            progress : {
                title : 'Please waiting',
                msg : 'Loading data...'
            }
        }
    };

    $.parser.plugins.push('app');
})(jQuery);
