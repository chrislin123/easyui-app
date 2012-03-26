(function ($) {
	var loaded = false;
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
