/**
 * Created by IntelliJ IDEA.
 * User: 夏悸
 * Date: 12-4-3
 * Time: 下午7:41
 */
$(function () {
    $('body').app({
        onTaskBlankContextMenu:onTaskBlankContextMenu,
        onAppContextMenu:onAppContextMenu,
        onWallContextMenu:onWallContextMenu
    });

    var appListMenuData = [
        {
            "text":"打开"
        },
        {
            "text":"关闭"
        },
        {
            "text":"关闭其他"
        },
        {
            "text":"关闭所有"
        },
        {
            "text":"任务管理器"
        },
        {
            "text":"属性"
        }
    ];

    var appListMenu = $('body').app('createMenu', appListMenuData);

    appListMenu.menu({
        onClick:function (item) {
           
        }
    });

    function onTaskBlankContextMenu(e, appid) {
        if (appid) {
            alert(appid);
            appListMenu.menu('findItem', '任务管理器').target.style.display = 'none';
            appListMenu.menu('findItem', '属性').target.style.display = 'none';
            appListMenu.menu('findItem', '打开').target.style.display = 'block';
            appListMenu.menu('findItem', '关闭').target.style.display = 'block';
            appListMenu.menu('findItem', '关闭其他').target.style.display = 'block';
            appListMenu.menu('findItem', '关闭所有').target.style.display = 'block';
        } else {
            appListMenu.menu('findItem', '任务管理器').target.style.display = 'block';
            appListMenu.menu('findItem', '属性').target.style.display = 'block';
            appListMenu.menu('findItem', '打开').target.style.display = 'none';
            appListMenu.menu('findItem', '关闭').target.style.display = 'none';
            appListMenu.menu('findItem', '关闭其他').target.style.display = 'none';
            appListMenu.menu('findItem', '关闭所有').target.style.display = 'none';
        }

        appListMenu.menu('show', {
            left:e.pageX,
            top:e.pageY
        });
        e.preventDefault();
    }


    var wallMenuData = [
        {
            "text":"属性",
            "href":"http://www.sina.com"
        },
        '-',
        {
            "text":"关于",
            "href":"http://www.btboys.com"
        }
    ];
    var appMenuData = [
        {
            "text":"打开",
            "href":"http://www.sina.com"
        },
        '-',
        {
            "text":"属性",
            "href":"http://www.btboys.com"
        }
    ];

    var wallMenu = $('body').app('createMenu', wallMenuData);
    var appMenu = $('body').app('createMenu', appMenuData);


    function onAppContextMenu(e,appid) {
        alert(appid);
        appMenu.menu('show', {
            left:e.pageX,
            top:e.pageY
        });
    }

    function onWallContextMenu(e) {
        wallMenu.menu('show', {
            left:e.pageX,
            top:e.pageY
        });
    }
});
