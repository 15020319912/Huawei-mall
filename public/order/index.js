window.onload = function() {
    $(".tab>ul>li:first-child").trigger('click');
}
$('li.whole').on('click', function() {
	$('.tab-content').css(
		"margin-left", "0px"	
	)
});
$('li.paid').on('click', function() {
	$('.tab-content').css(
		"margin-left", "-100%"	
	)
});
$('li.unPaid').on('click', function() {
	$('.tab-content').css(
		"margin-left", "-200%"	
	)
});

// 全部
$('li.whole').on('click', function() {
	$.$myAjax({
		url: '/order/list/all',
		type: 'get',
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		console.log(data);
		var details = data.details;
		
		data.forEach(function(item) {
			var html = '';
			item.details.forEach(function(details) {
				html += `
					<div class="item">
						<div class="item-list">
							<img src="${details.avatar}">
							<span class="name">${details.name}</span>
							<span class="price-count clearfix">
								<div class="price">￥${details.price}</div>
								<div class="count">x${details.count}</div>
							</span>
						</div>
					</div>
				`;
			})
			$(`
				<div class="top">
					<span class="top1">订单编号:</span>
					<span class="top2">${item.orderId}</span>
					<span class="top3">${item.isPay ? '已支付' : '未支付'}</span>
				</div>
				<div class="content">${html}</div>
				<div class="bottom clearfix">
					<div class="account clearfix">
						<div>总计：￥${item.account}</div>
					</div>
					<div class='operation'>
						<span class='del'>删除订单</span>
						<span class='see'>查看物流</span>
					</div>
				</div>
			`).appendTo('.tab-content>.whole');
		});
	});
});

//已付款
$('li.paid').on('click', function() {
	$.$myAjax({
		url: '/order/list/pay',
		type: 'get',
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		console.log(data);
		var details = data.details;
		
		data.forEach(function(item) {
			var html = '';
			item.details.forEach(function(details) {
				html += `
					<div class="item">
						<div class="item-list">
							<img src="${details.avatar}">
							<span class="name">${details.name}</span>
							<span class="price-count clearfix">
								<div class="price">￥${details.price}</div>
								<div class="count">x${details.count}</div>
							</span>
						</div>
					</div>
				`;
			})
			$(`
				<div class="top">
					<span class="top1">订单编号:</span>
					<span class="top2">${item.orderId}</span>
					<span class="top3">已付款</span>
				</div>
				<div class="content">${html}</div>
				<div class="bottom clearfix">
					<div class="account clearfix">
						<div>总计：￥${item.account}</div>
					</div>
					<div class='operation'>
						<span class='del'>删除订单</span>
						<span class='see'>查看物流</span>
					</div>
				</div>
			`).appendTo('.tab-content>.paid');
		});
	});
});

// 未付款
$('li.unPaid').on('click', function() {
	$.$myAjax({
		url: '/order/list/unpay',
		type: 'get',
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		console.log(data);
		var details = data.details;
		
		data.forEach(function(item) {
			var html = '';
			item.details.forEach(function(details) {
				html += `
					<div class="item">
						<div class="item-list">
							<img src="${details.avatar}">
							<span class="name">${details.name}</span>
							<span class="price-count clearfix">
								<div class="price">￥${details.price}</div>
								<div class="count">x${details.count}</div>
							</span>
						</div>
					</div>
				`;
			})
			$(`
				<div class="top">
					<span class="top1">订单编号:</span>
					<span class="top2">${item.orderId}</span>
					<span class="top3">未付款</span>
				</div>
				<div class="content">${html}</div>
				<div class="bottom clearfix">
					<div class="account clearfix">
						<div>总计：￥${item.account}</div>
					</div>
					<div class='operation'>
						<span class='del'>删除订单</span>
						<span class='see'>查看物流</span>
					</div>
				</div>
			`).appendTo('.tab-content>.unPaid');
		});
	});
});





