$('.address').on('click', function() {
	window.location.href = '/address/index.html';
});
var number = 0;
var account = 0;
var count = 0;
var price = 0;
// 从sessionStorage中读取要下单的商品的id
var ids = JSON.parse(sessionStorage.getItem('buy'));
// 发送ajax
$.$myAjax({
	url: '/cart/listbyids',
	type: 'post',
	data: { ids: JSON.stringify(ids) },
	headers: {
		'Authorization': sessionStorage.getItem("token"),
	}
})
.then(function(data) {
	console.log(data);
	data.forEach(function(item) {
		$(`
			<div class="wares clearfix">
				<span class="avatar"><img src="${item.avatar}" /></span>
				<div class="right">
					<p class="name">${item.name}</p>
					<span class="price">￥${item.price}</span>
					<span class="number">×${item.count}</span>
				</div>
			</div>
			<div class="parts">
				<span class="a">[配]</span>
				<span class="b"><img src="../images/orderConfiem/ping.jpg" />碎屏(含后盖)服务宝1年</span>
				<span>x1</span>
			</div>
			<div class="gift">
				<span class="a">[赠品]</span>
				<span class="b"><img src="../images/orderConfiem/icon_coupon.png" />【中国联通】5G套餐7折办理权益（站内信发放）</span>
				<span>x1</span>
			</div>
		`).appendTo('.content');
		
		count = item.count;			//数量
		number += count;			//总数量
		price = item.price;			//价格
		account = number * price;		//总价
		$('.total>span').text(account);
		
	});
});


var addressId = 0;
var url = window.location.href;
var temp = url.slice(url.indexOf('=') + 1);
console.log(temp === url);
if(temp === url) {
	console.log(1);
	$.$myAjax({		//拿取当前用户的默认地址
		url: '/address/getdefault',
		type: 'get',
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		addressId = data.id;
		console.log(data);
		$('.receiveName').text(data.receiveName);
		$('.receivePhone').text(data.receivePhone);
		$('.receiveRegion-Detail').text(data.receiveRegion + data.receiveDetail);
		$('.default').text('默认').css({
			display: 'inlne-block',
			border: '1px solid #CA141D'
		});
	});
} else { //选择地址
	addressId = parseInt(temp);
	console.log(addressId);
	$.$myAjax({
		url: '/address/getmodel/' + addressId,
		type: 'get',
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		
		$('.receiveName').text(data.receiveName);
		$('.receivePhone').text(data.receivePhone);
		$('.receiveRegion-Detail').text(data.receiveRegion + data.receiveDetail);
	});
}



$('.confirm').on('click', function() {
	//判断当前有没有合理的送货地址
	if(addressId === 0) { return console.log(请选择地址);}
	//生成订单
	$.$myAjax({
		url: '/order/confirm',
		type: 'post',
		data: {
			jsonStr: JSON.stringify({
				ids: ids,
				account: account,
				addressId: addressId,
			})
		},
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		//
		//
		window.location.replace('/pay/index.html?orderId= ' + data);
	});
});