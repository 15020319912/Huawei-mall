window.onload = function() {
    $(".order>ul>li:first-child").trigger('click');
}

//从url中解析出要看的是哪个商品分类
var url = window.location.href;
//当前页面全局变量
var cid = parseInt(url.slice(url.indexOf('=') + 1));
var searchName = '';		//记录用户输入的查询字符串
var orderCol = 'sale';		//
var orderDir = false;		//排序方向（默认降序）
var pageSize = 6;			//页容量
var hasMore = true;			//标识在当前条件下还有没有更多的商品可供加载
var isLoading = false;		//标识当前是否正在和服务器交互请求数据中
var scroll = null;			//标识页面scroll滚动对象
var isTriggerLoadMore = false; 		//标识是否出发了加载更多

//公共函数： 根据当前
function getAndShowData() {
	$('p.info').text('加载中...');
	var postData = {
		cid: cid,
		pageSize: pageSize,
		orderCol: orderCol,
		orderDir: orderDir,
		begin: $('ul.product-list>li').length,
		name: searchName
		
	};
	setTimeout(function() {		//故意延时
		$.$myAjax({
			url: '/product/list',
			type: 'post',
			data: { jsonStr: JSON.stringify(postData) }
		})
		.then(function(data) {
			isLoading = false;		//结束Loading状态
			hasMore = data.length === pageSize;
			if(hasMore)
				$('p.info').text('上拉加载更多...');
			else if(data.length === 0 && $('ul.product-list>li').length === 0)
				$('p.info').text('暂无相关商品，敬请期待...');
			else
				$('p.info').text('已到达底部...');
				//展示商品(如果有商品数据回来的话)
			if(data.length > 0) _showData(data);
		});
	}, 2000);
}

//给我数据我来拼接展示
function _showData(data) {
	data.forEach(function(item) {
		$(`
			<li>
				<a href='/detail/index.html?id=${item.id}'>
					<div class='avatar-wrapper'>
						<img class='active' src='${item.avatar}' />
					</div>
					<div class='detail'>
						<div class='detail-top'>
							<h3 class='name'>${item.name}</h3>
							<p class='remark'>${item.remark}</p>
						</div>
						<div class='detail-bottom'>
							<p class='price-wrapper'>￥ <span class='price'>${item.price}</span></p>
							<span class='sale'>售出 ${item.sale}</span>
							<span class='rate'>${item.rate} %好评</span>
						</div>
					</div>
				</a>
			</li>
		`).appendTo('ul.product-list');
	});
	//
	imagesLoaded($('.content')[0], function() {		//保证图片请求完毕
		setTimeout(function() {						//保证图片渲染完毕
			_initAndRefreshScroll();				//托管（双保险）
		}, 20);
	});
}

//初始化或更新isroll滚动对象
function _initAndRefreshScroll() {
	if(scroll) {
		scroll.refresh();		//scroll刷新
	} else {
		scroll = new IScroll($('.content')[0], {
			bounce: false,					//是否启用边界回弹效果
			deceleration: 0.003,			//设置滚动的阻尼系统
			click: true,					//取消滚动区域对click事件的屏蔽
			probeType: 2					//命令滚动区域实时触发srcoll滚动事件
		});
		scroll.on('scroll', function() {
			//监听
			if(hasMore && !isLoading) {
				if(this.y === this.maxScrollY) {
					isTriggerLoadMore = true;
					$('p.info').text('放手立即加载...');
				} else {
					isTriggerLoadMore = false;
					$('p.info').text('上拉加载更多...');
				}
			} 
		});
		scroll.on('scrollEnd', function() {
			if(isTriggerLoadMore) {
				isTriggerLoadMore = false;		//垂直成false
				isLoading = true;				//进入loading状态
				getAndShowData();
			}
		});
	}
	
	
}


//排序切换
$('.order>ul>li').on('click', function() {
	console.log(1);
	if(isLoading) {
		var $notice = $('<p class="notice">您的操作太频繁了，请稍后再试..</p>').appendTo('body');
		setTimeout(function() { $notice.remove(); }, 2000);
		return;
	}
	isLoading = true;		//防止恶意快速点击
	hasMore = true;			//重置hasMore
	$('ul.product-list').empty();		//清空商品列表，为新商品的显示做好准备
	if($(this).hasClass('active')) {
		orderDir = !orderDir;
		$('.order li').toggleClass('desc').toggleClass('asc');
		
	} else {
		orderCol = $(this).attr('data-col');
		$(this).addClass('active').siblings().removeClass('active');
	}
	//发送ajax请求商品数据并展示
	getAndShowData();
});

//指定查找
$('i.icon-search').on('click', function() {
	if(isLoading) {
		var $notice = $('<p class="notice">您的操作太频繁了，请稍后再试..</p>').appendTo('body');
		setTimeout(function() { $notice.remove(); }, 2000);
		return;
	}
	isLoading = true;		//防止恶意快速点击
	hasMore = true;			//重置hasMore
	$('ul.product-list').empty();		//清空商品列表，为新商品的显示做好准备
	searchName = $('input.search').val();	//记录用户当前的搜索关键字
	//发送ajax请求商品数据并展示
	getAndShowData();
	//
});

//
$('i.mode').on('click', function() {
	$('i.mode').toggle();
	$('ul.product-list').toggleClass('list').toggleClass('card');
	setTimeout(function() {
		if(scroll) scroll.refresh();
	}, 20);
});




