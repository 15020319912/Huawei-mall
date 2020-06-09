//动态判断去哪个页面
var url = window.parent.location.href;
if(url.indexOf('home') !== -1)
	$('ul.nav>li').eq(0).addClass('active');
else if(url.indexOf('category') !== -1)
	$('ul.nav>li').eq(1).addClass('active');
else if(url.indexOf('cart') !== -1)
	$('ul.nav>li').eq(2).addClass('active');
else
	$('ul.nav>li').eq(3).addClass('active');