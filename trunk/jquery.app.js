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
	var opened = {};
	
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
		
		center.panel({
			onResize : function (width, height) {
				appReset(target);
				setTaskListWidth(target);
			}
		});
	}
	
	/**
	 * 初始化任务栏
	 * @param target
	 */
	function initTaskBlank(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var taskBlank = jqTarget.layout('panel', opts.taskBlankPos); //获取任务栏Layou面板容器
		var taskBar = $('<div/>').addClass('app-taskBar'); //创建任务栏对象
		
		var start = $('<a onfocus="this.blur()" href="javascript:void(0)"></a>'); //开始菜单按钮
		var taskList = $('<div/>'); //创建任务区域
		var calendar = $('<div/>'); //创建时间区域
		
		if (opts.taskBlankPos == 'south' || opts.taskBlankPos == 'north') {
			taskBar.addClass('app-taskBar-bg1');
			start.addClass('app-startMenu-x');
			taskList.addClass('app-taskList-x');
			calendar.addClass('app-taskBar-calendar-x');
			
			var scrollLeft = $('<div/>').addClass('app-scroll-left').appendTo(taskList);
			var scrollRight = $('<div/>').addClass('app-scroll-right').appendTo(taskList);
			var listWrap = $('<div/>').addClass('app-list-wrap').appendTo(taskList);
			var list = $('<ul/>').addClass('app-list-list').appendTo(listWrap);
			
		} else {
			taskBar.addClass('app-taskBar-bg2');
			start.addClass('app-startMenu-y');
			taskList.addClass('app-taskList-y');
			calendar.addClass('app-taskBar-calendar-y');
			
			var scrollTop = $('<div/>').addClass('app-scroll-top').appendTo(taskList);
			var scrollBottom = $('<div/>').addClass('app-scroll-bottom').appendTo(taskList);
		}
		
		//依次添加到任务栏对象里面
		start.appendTo(taskBar);
		taskList.appendTo(taskBar);
		calendar.appendTo(taskBar);
		taskBar.appendTo(taskBlank);
		
		$.data(target, 'app')['taskBar'] = taskBar;
		$.data(target, 'app')['start'] = start;
		$.data(target, 'app')['taskList'] = taskList;
		$.data(target, 'app')['calendar'] = calendar;
		
		setTaskListWidth(target);
	}
	
	function setTaskListWidth(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var taskBlank = jqTarget.layout('panel', opts.taskBlankPos); //获取任务栏Layou面板容器
		var taskList = $.data(target, 'app')['taskList'];
		
		if (opts.taskBlankPos == 'south' || opts.taskBlankPos == 'north') {
			taskList.width(taskBlank.width() - 130);
		} else {
			taskList.height(taskBlank.height() - 75);
		}
	}
	
	/**
	 *初始化桌面
	 * @param target
	 */
	function initDeskTop(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var wall = jqTarget.layout('panel', 'center'); //桌面对象
		var appContainer = $('<ul/>').addClass('app-container'); //app容器
		
		var lines = Math.floor((wall.height() - 20) / (opts.iconSize + 45)); //可显示行数
		var columns = Math.floor((wall.width() - 20) / (opts.iconSize + 45)); //可显示列数
		var wallMax = lines * columns; //每页显示app最大值
		var lineAppBlank = ((wall.height() - 20) - (opts.iconSize + 45) * lines) / lines; //行间隔高度
		var columnAppBlank = ((wall.width() - 20) - (opts.iconSize + 45) * columns) / columns; //列间隔宽度
		//初始值
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
			var relSize = opts.iconSize + 45;
			for (var i in apps) {
				if (line > lines) {
					line = 1;
					top = 20;
					left += relSize + columnAppBlank;
					col++;
				}
				
				var app = apps[i];
				
				var appItem = $('<li/>').css({
						height : relSize,
						width : relSize
					});
				
				appItem.data('app', app); //绑定每个app的详细信息到app元素上
				appItem.attr("app_id", UUID()); //指定app的唯一标识
				
				appItem.css({
					left : left,
					top : top
				});
				
				var icon = $('<img/>').height(opts.iconSize).width(opts.iconSize).attr('src', app.icon).appendTo(appItem);
				var text = $('<span/>').text(app.text).appendTo(appItem);
				var em = $('<em/>').css({
						height : relSize,
						width : relSize
					}).appendTo(appItem);
				
				appItem.appendTo(appContainer);
				
				top += relSize + lineAppBlank; //下一行的top值
				line++;
				
				if ($.browser.msie) { //兼容ie的hover
					appItem.hover(function () {
						$(this).addClass('hover');
					}, function () {
						$(this).removeClass('hover');
					});
				}
				
				initAppDrag(appItem); //初始化app的拖拽事件
				
				if (opts.dbClick) { //绑定App的点击事件（dbClick是否双击）
					appItem.on('dblclick', function () {
						openApp.call(this, target);
					});
				} else {
					appItem.on('click', function () {
						openApp.call(this, target);
					});
				}
			}
			appContainer.appendTo(wall);
			
			initContextMenu();
			
			$.data(target, 'app')['appContainer'] = appContainer;
		}
		
		/**
		 * 初始化图标拖拽
		 * @param appItem
		 */
		function initAppDrag(appItem) {
			appItem.draggable({
				revert : true,
				cursor : "default"
			}).droppable({
				onDrop : function (e, source) {
					if ($(source).prev().attr('app_id') == $(this).attr('app_id')) {
						$(source).insertBefore(this);
					} else {
						$(source).insertAfter(this);
					}
					setTimeout(function () {
						appReset(target);
					}, 0);
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
			var wallMenu = createMenu(target, wallMenuData);
			var appMenu = createMenu(target, appMenuData);
			
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
	function appReset(target) {
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var wall = jqTarget.layout('panel', 'center');
		var appContainer = $.data(target, 'app').appContainer;
		
		var lines = Math.floor((wall.height() - 20) / (opts.iconSize + 45)); //可显示行数
		var columns = Math.floor((wall.width() - 20) / (opts.iconSize + 45)); //可显示列数
		var wallMax = lines * columns; //每页显示app最大值
		var lineAppBlank = ((wall.height() - 20) - (opts.iconSize + 45) * lines) / lines; //行间隔高度
		var columnAppBlank = ((wall.width() - 20) - (opts.iconSize + 45) * columns) / columns; //列间隔宽度
		
		//初始值
		var line = 1,
		col = 1,
		top = 20,
		left = 10;
		
		var relSize = opts.iconSize + 45;
		appContainer.children().each(function () {
			if (line > lines) {
				line = 1;
				top = 20;
				left += relSize + columnAppBlank;
				col++;
			}
			$(this).css({
				left : left,
				top : top
			});
			
			top += relSize + lineAppBlank;
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
			startMenuDiv = createMenu(target, menus);
			
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
	function createMenu(target, menus) {
		var opts = $.data(target, 'app').options;
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
		
		return startMenuDiv.menu({
			onClick : function (item) {
				opts.menuClick.call(this, item, $(item.target).attr("url"));
			}
		});
		
		/**
		 * 递归添加子菜单
		 * @param menu
		 */
		function appendChild(menu) {
			var itemText = menu.text,
			childrens = menu.children;
			var item = $('<div/>').append($('<span></span>').html(itemText)).attr("url", menu.href);
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
		var jqTarget = $(target);
		var opts = $.data(target, 'app').options;
		var calendar = $.data(target, 'app')['calendar'];
		function init() {
			var nowDate = new Date();
			var year = nowDate.getFullYear();
			var month = nowDate.getMonth() + 1;
			var date = nowDate.getDate();
			var day = nowDate.getDay() + 1;
			var time = nowDate.toLocaleTimeString();
			if (opts.taskBlankPos == 'south' || opts.taskBlankPos == 'north') {
				calendar.html(year + '年' + month + '月' + date + '日<br/>' + time);
			} else {
				var t = nowDate.getHours() + ':';
				if (nowDate.getMinutes() < 10) {
					t += '0';
				}
				t += nowDate.getMinutes();
				calendar.html(t);
			}
		}
		init();
		window.setInterval(function () {
			init();
		}, 1000);
		
		var calendarDiv = $('<div/>').appendTo('body').calendar({
				current : new Date()
			}).hide();
		
		var taskBar = $.data(target, 'app')['taskBar'];
		var t = parseInt(document.body.clientHeight) - parseInt(calendarDiv.css('height'));
		var l = parseInt(document.body.clientWidth) - parseInt(calendarDiv.css('width'));
		if (opts.taskBlankPos == 'south') {
			t -= parseInt($(taskBar).css('height'));
		} else if (opts.taskBlankPos == 'north') {
			t = 0 + parseInt($(taskBar).css('height'));
		} else if (opts.taskBlankPos == 'west') {
			l = 0 + parseInt($(taskBar).css('width'));
		} else {
			l -= parseInt($(taskBar).css('width'));
		}
		calendarDiv.css({
			"top" : t,
			"left" : l,
			"position" : "absolute"
		});
		
		calendar.click(function () {
			calendarDiv.slideToggle();
		});
		jqTarget.click(function (e) {
			var c = $(e.target).attr('class');
			if (c != 'app-taskBar-calendar-x' && c != 'app-taskBar-calendar-y') {
				calendarDiv.hide();
			}
		});
	}
	
	/**
	 * 初始化widget
	 * @param target
	 */
	function initWidget(target) {}
	
	function menuClick(item, url) {
		if (item.text == "关于") {
			$.messager.alert("提示", "这是easyui的app");
		}
	}
	
	/**
	 * 打开默认实现
	 * @param target
	 */
	function openApp(target) {
		var jqTarget = $(target);
		var opt = $(target).data('app').options;
		var uuid = $(this).attr('app_id');
		var appOpt = $(this).data("app");
		var wall = jqTarget.layout('panel', 'center');
		
		var thisAppwindow = $('div[w_id="' + uuid + '"]', wall);
		if (thisAppwindow.length) {
			thisAppwindow.dialog('open');
			return;
		}
		
		var appWindow = $('<div/>').attr('w_id', uuid).appendTo(wall);
		var opened = wall.children('div.window');
		var T = opened.length * 25 + 10;
		var L = opened.length * 25 + 300;
		
		var customOption = opt.onBeforeOpenApp.call(target, appOpt) || {};
		
		var defaultConfig = {
			height : 400,
			width : 700,
			resizable : true,
			maximizable : true,
			minimizable : true,
			shadow : false,
			top : T,
			left : L
		};
		
		var defaultRequiredConfig = {
			title : appOpt.text,
			inline : true,
			cache : false,
			onOpen : function () {
				appendToList($(this).attr('w_id'), $.data(this, 'panel').options.title);
				if (customOption.onOpen) {
					customOption.onOpen.call(this);
				} else {
					if (opt.onOpenApp)
						opt.onOpenApp.call(this);
				}
			},
			onClose : function () {
				var frame = $('iframe', this);
				if (frame.length > 0) { //释放iframe
					if (!/^http/i.test(frame[0].src)) {
						frame[0].contentWindow.document.write('');
					}
					frame[0].contentWindow.close();
					frame.remove();
					if ($.browser.msie) {
						CollectGarbage();
					}
				} else { //释放combo
					$(this).find(".combo-f").each(function () {
						var panel = $(this).data().combo.panel;
						panel.panel("destroy");
					});
				}
				
				removeListItem($(this).attr('w_id'));
				
				if (customOption.onClose) {
					customOption.onClose.call(this);
				} else {
					if (opt.onClosedApp)
						opt.onClosedApp.call(this);
					
				}
				
				$(this).dialog("destroy");
			},
			onMinimize : function () {
				if ($(this).prev('.window-header').find('.panel-tool-restore').length == 1) {
					var opts = $.data(this, 'panel').options;
					opts.maximized = true;
				}
				if (customOption.onMinimize) {
					customOption.onMinimize.call(this);
				}
			},
			onMove : function (left, top) {
				var opts = $.data(this, 'panel').options;
				if (top < 0) {
					$(this).dialog("move", {
						"left" : left,
						"top" : 0
					});
					$(this).dialog("maximize");
				} else if (opts.maximized) {
					$(this).dialog("restore");
					$(this).dialog("move", {
						"left" : left + 100,
						"top" : top
					});
				}
				if (top > wall.height()) {
					$(this).dialog("move", {
						"left" : left,
						"top" : (wall.height() - 25)
					});
				}
				if (customOption.onMove) {
					customOption.onMove.call(this);
				}
			}
		};
		
		var config = $.extend({}, defaultConfig, customOption, defaultRequiredConfig);
		
		if (appOpt.href && !/^http/i.test(appOpt.href)) {
			config.href = appOpt.href;
		}
		appWindow.dialog(config);
		
		if (appOpt.href && /^http/i.test(appOpt.href)) {
			var iframe = $('<iframe/>').attr({
					width : '100%',
					height : '99%',
					frameborder : 0,
					src : appOpt.href
				});
			appWindow.find('.dialog-content').append(iframe);
		}
		
		appWindow.prev('div.window-header').click(function (e) {
			var taskList = jqTarget.data('app').taskList;
			var list = taskList.find('ul.app-list-list');
			list.children().removeClass('selected');
			$('li[l_id="' + uuid + '"]', list).addClass('selected');
		});
		
		appWindow.click(function () {
			$(this).dialog('open');
		});
		
		/**
		 * 添加任务栏站位
		 * @param uuid
		 * @param text
		 * @param status
		 */
		function appendToList(uuid, text) {
			var taskList = jqTarget.data('app').taskList;
			var list = taskList.find('ul.app-list-list');
			var wrap = list.parent();
			list.children().removeClass('selected');
			
			if ($('li[l_id="' + uuid + '"]', list).length) {
				$('li[l_id="' + uuid + '"]', list).addClass('selected');
			} else {
				var item = $('<li/>').attr("l_id", uuid).addClass('selected').text(text);
				list.append(item);
				item.click(function () {
					$('div[w_id="' + uuid + '"]', wall).dialog('open');
					list.children().removeClass('selected');
					$(this).addClass('selected');
				});
				
				if (wrap.width() > taskList.width()) {
					wrap.width(taskList.width());
					$('div[class^="app-scroll-"]', taskList).show();
				}
				
				if (list.children().length != 1) {
					wrap.width(item.outerWidth() + 10 + wrap.width());
				} else {
					wrap.width(item.outerWidth() + 10);
				}
			}
		}
		
		/**
		 * 移除任务栏站位
		 * @param uuid
		 */
		function removeListItem(uuid) {
			var item = $('li[l_id="' + uuid + '"]');
			var wrap = item.parent().parent();
			
			wrap.width(wrap.width() - (item.outerWidth() + 4));
			
			item.remove();
		}
	}
	
	/**
	 * 生成UUID
	 */
	function UUID() {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return "UUID-" + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
	
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
			$('body').attr({
				oncontextmenu : 'return false',
				onselectstart : 'return false',
				ondragstart : 'return false',
				onbeforecopy : 'return false',
				oncopy : 'document.selection.empty()',
				onselect : 'document.selection.empty()'
			}); //禁用全局右键菜单
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
				appReset(this);
			});
		},
		setIconSize : function (size) {
			return this.each(function () {
				$.data(this, 'app').options.iconSize = size;
				var appContainer = $.data(this, 'app').appContainer;
				appContainer.find("img").height(size).width(size);
				appContainer.find("em,li").height(size + 45).width(size + 45);
				appReset(this);
			});
		}
	};
	
	$.fn.app.parseOptions = function () {};
	
	$.fn.app.defaults = {
		taskBlankPos : 'south', //任务栏的位置（north|south|west|east）
		iconSize : 32,
		dbClick : true,
		wallpaper : null,
		onBeforeOpenApp : function (appOpt) {},
		onOpenApp : function () {},
		onClosedApp : function () {},
		menuClick : menuClick,
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
