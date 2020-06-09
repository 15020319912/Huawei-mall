// var aaa = parseInt(location.search.slice(location.search.indexOf('=') + 1));
//1.从数据库中获取信息并动态添加

var aaa = parseInt(location.search.slice(location.search.indexOf('=') + 1));
$.$myAjax({
	url: '/product/model/' + aaa,
	type: 'get'
})
.then(function(data) {
	data.banner.split(',').forEach(function(item) {
		$(`
			<div class="swiper-slide">
				<img src="${item}" />
			</div>
		`).appendTo('.banner1');
	});
	$('.price').text(data.price);
	$('.name').text(data.name);
	$('.remark').text(data.remark);
});

// 


// 加入购物车并确定

$('span.add-cart').on('click', function() {
	$.$myAjax({
		url: '/cart/add',
		type: 'post',
		data: { jsonStr: JSON.stringify({ pid: aaa, count: $(".count").val() }) },
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {});
});

$.$myAjax({
	url: '/cart/total',
	type: 'get',
	headers: {
		'Authorization': sessionStorage.getItem("token"),
	}
})
.then(function(data) {
	$('.number').text(data);
});

function countChange(count) {
	//3. 更新increase和decrease的disable状态 对 + - 按钮的操作
	document.querySelector('span.reduce').disabled = count === 1;
	document.querySelector('span.add').disabled = count === 5;
}

//减
$('.reduce').on('click', function() {
	var a = $(this);
	a.siblings('.add').removeClass('a');
	if(a.hasClass('a')) {
		return;
	} else {
		var countEl = a.next();
		var count = parseInt(countEl.val()) - 1;
		countEl.val(count);
		
		if(count <= 1) a.addClass('a');
	}
});

//加
$('.add').on('click', function() {
	var a = $(this);
	a.siblings('.reduce').removeClass('a');
	if(a.hasClass('a')) {
		return;
	} else {
		var countEl = a.prev();
		var count = parseInt(countEl.val()) + 1;
		countEl.val(count);
		if(count >= 5) a.addClass('a');
				
	}
});













