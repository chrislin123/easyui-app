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
	 * layout初始化
	 * @param target
	 */
	function initLayout(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		
		var center = $('<div/>').attr({
				'border' : false,
				'region' : 'center'
			}).addClass('app-wall').appendTo(jqTarget);
		//墙纸设置
		if (opts.wallpaper) {
			center.css('background-image', 'url("' + opts.wallpaper + '")');
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
	function initTaskBlank(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var taskBlank = jqTarget.layout('panel', opts.taskBlankPos); //获取任务栏Layou面板容器
		
		
		var start = $('<a class="app-startmenu-x" onfocus="this.blur()" href="javascript:void(0)"></a>'); //开始菜单按钮
		var tasklist = $('<div/>'); //创建任务区域
		var calendar = $('<div/>'); //创建时间区域
		
		//		var split1 = $('<div/>').addClass('app-taskbar-split-h');//左边分割线
		//		var split2 = $('<div/>').addClass('app-taskbar-split-h');//左边分割线
		
		var taskBar = $('<div/>').addClass('app-taskbar'); //创建任务栏对象
		if (opts.taskBlankPos == 'south' || opts.taskBlankPos == 'north') {
			taskBar.addClass('app-taskbar-bg1');
		} else {
			taskBar.addClass('app-taskbar-bg2');
			start.removeClass('app-startmenu-x');
			start.addClass('app-startmenu-y');
			//			split1.removeClass('app-taskbar-split-h');
			//			split1.addClass('app-taskbar-split-w');
			//			split2.removeClass('app-taskbar-split-h');
			//			split2.addClass('app-taskbar-split-w');
		}
		
		//依次添加到任务栏对象里面
		start.appendTo(taskBar);
		//split1.appendTo(taskBar);
		tasklist.appendTo(taskBar);
		//split2.css('float','right');
		//split2.appendTo(taskBar);
		calendar.appendTo(taskBar);
		taskBar.appendTo(taskBlank);
		
		$.data(target, 'app')['taskBar'] = taskBar;
		$.data(target, 'app')['start'] = start;
		$.data(target, 'app')['tasklist'] = tasklist;
		$.data(target, 'app')['calendar'] = calendar;
	}
	
	/**
	 *初始化桌面
	 * @param target
	 */
	function initDeskTop(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var wall = jqTarget.layout('panel', 'center');
		var appContainer = $('<ul/>').addClass('app-container');
		var lines = Math.floor(wall.height() / (opts.iconSize + 45));
		var line = 1,
		col = 1,
		top = 20,
		left = 10;
		
		if (opts.loadUrl.app && !loaded) {
			$.get(opts.loadUrl.app, function (resp) {
				initApp(resp);
			}, 'JSON');
		}
		
		/**
		 * 初始app
		 * @param apps
		 */
		function initApp(apps) {
			var relSize = opts.iconSize + 25;
			for (var i in apps) {
				if (line > lines) {
					line = 1;
					top = 20;
					left += relSize + 20;
					col++;
				}
				
				var app = apps[i];
				var appItem = $('<li/>').css({
						height : relSize,
						width : relSize + 20
					}).data('app', app);
				appItem.attr("app_id", app.id);
				
				appItem.css({
					left : left,
					top : top
				});
				
				var icon = $('<img/>').height(opts.iconSize).width(opts.iconSize).attr('src', app.icon).appendTo(appItem);
				var text = $('<span/>').text(app.text).appendTo(appItem);
				var em = $('<em/>').css({
						height : relSize + 20,
						width : relSize + 20
					}).appendTo(appItem);
				
				appItem.appendTo(appContainer);
				top += relSize + 20;
				line++;
				if ($.browser.msie) {
					appItem.hover(function () {
						$(this).addClass('hover');
					}, function () {
						$(this).removeClass('hover');
					});
				}
				initAppDragg(appItem);
			}
			appContainer.appendTo(wall);
			
			$(window).resize(function () {
				setTimeout(function () {
					appReset(target, appContainer);
				}, 500); ;
			});
			
			initContextMenu();
			
			$.data(target, 'app')['appContainer'] = appContainer;
		}
		
		/**
		 * 初始化图标拖拽
		 * @param appItem
		 */
		function initAppDragg(appItem) {
			appItem.draggable({
				revert : true,
				cursor : "default",
				onStopDrag : function () {
					appReset(target, appContainer);
				}
			}).droppable({
				onDrop : function (e, source) {
					if ($(source).prev().attr('app_id') == $(this).attr('app_id')) {
						$(source).insertBefore(this);
					} else {
						$(source).insertAfter(this);
					}
				},
				accept : '.app-container li'
			})
		}
		
		/**
		 * 初始化右键菜单
		 * @param appItem
		 */
		function initContextMenu() {
			var wallMenuData = [{
					"text" : "属性",
					"href" : "http://www.sina.com"
				}, '-', {
					"text" : "关于",
					"href" : "http://www.btboys.com"
				}
			];
			var appMenuData = [{
					"text" : "打开",
					"href" : "http://www.sina.com"
				}, '-', {
					"text" : "属性",
					"href" : "http://www.btboys.com"
				}
			];
			var appItems = appContainer.children();
			var wallMenu = createMenu(wallMenuData);
			var appMenu = createMenu(appMenuData);
			
			wall.mousedown(function (e) {
				if (e.target != appContainer[0])
					return;
				
				appItems.removeClass("select");
			}).bind('contextmenu', function (e) {
				if (e.target != appContainer[0])
					return;
				
				wallMenu.menu('show', {
					left : e.pageX,
					top : e.pageY
				});
				e.preventDefault();
			});
			
			appItems.mousedown(function () {
				appItems.removeClass("select");
				$(this).addClass("select");
			}).bind('contextmenu', function (e) {
				appMenu.menu('show', {
					left : e.pageX,
					top : e.pageY
				});
				e.preventDefault();
			});
		}
	}
	
	/**
	 * 初始app
	 * @param target
	 * @param appContainer
	 */
	function appReset(target, appContainer) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var wall = jqTarget.layout('panel', 'center');
		var lines = Math.floor(wall.height() / (opts.iconSize + 45));
		var line = 1,
		col = 1,
		top = 20,
		left = 10,
		relSize = opts.iconSize + 25;
		appContainer.children().each(function () {
			if (line > lines) {
				line = 1;
				top = 20;
				left += relSize + 20;
				col++;
			}
			$(this).css({
				left : left,
				top : top
			});
			
			top += relSize + 20;
			line++;
		});
	}
	
	/**
	 *初始化开始菜单
	 * @param target
	 */
	function initStartMenu(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var wall = jqTarget.layout('panel', 'center');
		var startMenuDiv;
		
		if (opts.loadUrl.startMenu && !loaded) {
			$.get(opts.loadUrl.startMenu, function (menus) {
				initMenu(menus);
			}, 'JSON');
		}
		
		/**
		 * 初始化菜单
		 * @param menus
		 */
		function initMenu(menus) {
			startMenuDiv = createMenu(menus);
			
			//添加“退出”菜单
			startMenuDiv.menu("appendItem", {
				id : "easyui_app_logout",
				text : "退出"
			});
			
			var start = $.data(target, 'app')['start'];
			//确定菜单显示位置
			var left = 0,
			top = 0;
			
			start.click(function (e) {
				if (opts.taskBlankPos == 'south') {
					top = wall.height();
				} else if (opts.taskBlankPos == 'north') {
					top = start.height();
				} else if (opts.taskBlankPos == 'west') {
					top = start.height() + 7;
				} else if (opts.taskBlankPos == 'east') {
					left = wall.width();
					top = start.height() + 7;
				}
				
				startMenuDiv.menu('show', {
					left : left,
					top : top
				});
			});
			
			start.data('menu', startMenuDiv);
		}
	}
	
	/**
	 * 创建菜单dom
	 * @param menus
	 */
	function createMenu(menus) {
		var startMenuDiv = $('<div style="width:200px;"></div>').appendTo('body');
		for (var i = 0; i < menus.length; i++) {
			var menu = menus[i];
			if (menu == '-') {
				var sep = $('<div class="menu-sep"></div>');
				startMenuDiv.append(sep);
				continue;
			}
			if (menu.children) {
				startMenuDiv.append(appendChild(menu));
			} else {
				var item = $('<div></div>').html(menu.text).attr("url", menu.href); //未添加点击事件
				if (menu.iconCls) {
					item.attr('iconCls', menu.iconCls);
				}
				startMenuDiv.append(item);
			}
		}
		
		return startMenuDiv.menu();
		
		/**
		 * 递归添加子菜单
		 * @param menu
		 */
		function appendChild(menu) {
			var itemText = menu.text,
			childrens = menu.children;
			var item = $('<div/>').append($('<span></span>').html(itemText));
			if (menu.iconCls) {
				item.attr('iconCls', menu.iconCls);
			}
			
			var ci = $('<div style="width:200px;"></div>');
			for (var i = 0; i < childrens.length; i++) {
				var cmenu = childrens[i];
				if (cmenu == '-') {
					var sep = $('<div class="menu-sep"></div>');
					startMenuDiv.append(sep);
					continue;
				}
				if (cmenu.children) {
					item.append(ci.append(appendChild(cmenu)));
				} else {
					var citem = $('<div/>').html(cmenu.text).attr("url", cmenu.href); //未添加点击事件
					if (cmenu.iconCls) {
						citem.attr('iconCls', cmenu.iconCls);
					}
					item.append(ci.append(citem));
				}
			}
			return item;
		}
	}
	
	/**
	 * 初始化时间
	 * @param target
	 */
	function initCalendar(target) {
		function init() {
			var jqTarget = $(target);
			var opts = $.data(target, 'app').options;
			var calendar = $.data(target, 'app')['calendar'];
			var nowDate = new Date();
			var year = nowDate.getFullYear();
			var month = nowDate.getMonth() + 1;
			var date = nowDate.getDate();
			var day = nowDate.getDay() + 1;
			var time = nowDate.toLocaleTimeString();
			if (opts.taskBlankPos == 'south' || opts.taskBlankPos == 'north') {
				calendar.removeClass('app-taskbar-calendar-y');
				calendar.addClass('app-taskbar-calendar-x');
				calendar.html(year + '年' + month + '月' + date + '日<br/>' + time);
			} else {
				calendar.removeClass('app-taskbar-calendar-x');
				calendar.addClass('app-taskbar-calendar-y');
				calendar.html(nowDate.getHours() + ':' + nowDate.getMinutes());
			}
		}
		init();
		window.setInterval(function() {
			init();
		}, 1000);
	}
	
	/**
	 * 初始化widget
	 * @param target
	 */
	function initWidget(target) {}
	
	/**
	 * 墙纸设置
	 * @param target
	 * @param url
	 */
	function setWallpaper(target, url) {
		var wall = $(target).layout('panel', 'center');
		wall.css('background-image', 'url("' + url + '")');
		$.data(target, 'app').options.wallpaper = url;
	}
	
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
		
		setTimeout(function () {
			$('body').attr('oncontextmenu', 'return false'); //禁用全局右键菜单
		}, 500);
	}
	
	$.fn.app = function (options, params) {
		if (typeof options === 'string') {
			return $.fn.app.methods[options].call(this, params);
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
	
	$.fn.app.methods = {
		options : function () {
			return $.data(this[0], 'app').options;
		},
		setWallpaper : function (wallpaperUrl) {
			return this.each(function () {
				setWallpaper(this, wallpaperUrl);
			});
		},
		appReset : function () {
			return this.each(function () {
				var appContainer = $.data(this, 'app').appContainer;
				appReset(this, appContainer);
			});
		}
	};
	
	$.fn.app.parseOptions = function () {};
	
	$.fn.app.defaults = {
		taskBlankPos : 'south', //任务栏的位置（north|south|west|east）
		iconSize : 32,
		wallpaper : null,
		loadUrl : {
			app : 'apps.json',
			startMenu : 'startMenu.json'
		},
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
