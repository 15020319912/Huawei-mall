// 1. 用户进购物车页面时有没有登录
// 没登录：显示一个 友好提示，提供一个按钮让用户点击可以去登录页面
// 登录了：发ajax前携带token，向服务器请求当前登录用户的所有购物车数据

var name = sessionStorage.getItem('name');	//从sessionStorage中获取的用户
if(!name) {
	$('.cart-unlogin').css({
		display: 'block'
	});
} else {
	$.ajax({
		url: '/cart/list',
		type: 'post',
		headers: {
			'Authorization': sessionStorage.getItem("token"),
		},
		success: function(result) {
			console.log(result.status === 200 && result.data.length > 0);
			
			if(result.status === 200 && result.data.length > 0) {
				result.data.forEach(function(item) {
					$(`
						<div class="item-wrapper" data-id="${item.id}"> 
							<div class="left">
								<span class="check1"></span>
							</div>
							<div class="left-b">
								<span class="check3"></span>
							</div>
							<div class="right clearfix">
								<a href="#" class="img-wrapper"><img src="${item.avatar}" /></a>
								<div class="item">
									<span class="item-name">${item.name}</span><br>
									<span class="item-remark">分期免息</span>
									<div class="item-bottom clearfix">
										<span class="price-wrapper">
											￥<span class="price">${item.price}</span>
										</span>
										<div class="num-wrapper">
											<span class="reduce ${item.count === 1 ? 'a' : ''}"></span>
											<input class="count" value="${item.count}" />
											<span class="add ${item.count === 5 ? 'a' : ''}"></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					`).appendTo('.selected');
				});
			} else {
				$('.cart-empty').css({
					display: 'block'
				});
				// $('.settlement-wrapper').css{{
				// 	display: 'none';
				// }};
			}
		}
	});
}

// 正反选择的点击事件

// 单个商品的正反选点击事件
$('.selected').on('click', '.left', function() {
	$(this).find('span').toggleClass('check2').toggleClass('check1');
	var number = 0;
	var total = 0;
	var count = 0;
	var price = 0;
	$('.selected .left>.check2').each(function() {
		count = parseInt($(this).parent().siblings('.right').find('.count').val());		//数量
		number += count;																//总数量	
		price = parseInt($(this).parent().siblings('.right').find('.price').text());	//价格
		total += price * count;														//总价格	
	});
	$('.number').text(number);
	$('.total-price').text(total);;
	
});
$('.selected').on('click', '.left-b', function() {
	$(this).find('span').toggleClass('check4').toggleClass('check3');
});

// 全选商品的正反选点击事件
$('.settlement-wrapper>.check-wrapper>.check1').on('click', function() {
	var span = $('.settlement-wrapper>.check-wrapper>span');
	$('.settlement-wrapper>.check-wrapper>span').toggleClass('check2').toggleClass('check1');
	var a = span[0].className;
	console.log(span[0].className === ckeck2);
	if(a === 'ckeck2') {
		console.log(1);
	}
	
});
$('.delete-wrapper>.check-wrapper>.check3').on('click', function() {
	$('.delete-wrapper>.check-wrapper>span').toggleClass('check4').toggleClass('check3');
	
	
	
});

// 减法
$('.selected').on('click', '.reduce', function() {
	var a = $(this);
	a.siblings('.add').removeClass('a');
	if(a.hasClass('a')) {
		return;
	} else {
		$.$myAjax({
			url: '/cart/decrease/' + parseInt(a.parent().parent().parent().parent().parent().attr('data-id')),	//找到藏得dat-id的位置
			type:'post',
			headers: { 
				'Authorization': sessionStorage.getItem("token"),
			}
		})
		.then(function() {
			var countEl = a.next();
			var count = parseInt(countEl.val()) - 1;
			countEl.val(count);
			if(count <= 1) a.addClass('a');
		});
	}
});

//加
$('.selected').on('click', 'span.add', function() {
	var a = $(this);
	a.siblings('.reduce').removeClass('a');
	if(a.hasClass('a')) {
		return;
	} else {
		$.$myAjax({
			url: '/cart/increase/' + parseInt($(this).parent().parent().parent().parent().parent().attr('data-id')),
			type:'post',
			headers: { 
				'Authorization': sessionStorage.getItem("token"),
			}
		})
		.then(function() {
			var countEl = a.prev();
			var count = parseInt(countEl.val()) + 1;
			countEl.val(count);
			console.log(count);
			if(count >= 5) a.addClass('a');
		});
	}
});

//用户手动输入数量处理
$('.selected').blur('input.count', function() {
	var countEl = $(this);
	var count = parseInt(countEl.val());
	// count值的有效性判断
	if(count < 1) count = 1;
	if(count > 5) count = 5;
	countEl.value = count;
});



//全选反选功能事件绑定



//5. 进入编辑状态后，如果用户选中购物记录要做删除操作
$('span.right').on('click', function() {
	var show = $('span.right').css('display');
	if( show === 'block' ) {
		$('span.right').css('display','none');
		$('.left').css('display','none');
		$('.settlement-wrapper').css('display','none');
		
		$('span.right-b').css('display','block');
		$('.left-b').css('display','block');
		$('.delete-wrapper').css('display','block');
	}
});

$('span.right-b').on('click', function() {
	var show = $('span.right-b').css('display');
	if( show === 'block' ) {
		$('span.right-b').css('display','none');
		$('.left-b').css('display','none');
		$('.delete-wrapper').css('display','none');
		
		$('span.right').css('display','block');
		$('.left').css('display','block');
		$('.settlement-wrapper').css('display','block');
	}
});
$.$myAjax({
	url: '/cart/remove',
	type:'post',
	data: { ids: JSON.stringify([]) },
	headers: { 
		'Authorization': sessionStorage.getItem("token"),
	}
})
.then(function() {});

// 
var buy = [];
$('.settlement-wrapper .sn').on('click', function() {
	$('span.check2').each(function() {
		buy.push($(this).parent().parent().attr('data-id'));
	});
	sessionStorage.setItem('buy', JSON.stringify(buy));
	window.location.href = '../orderConfirm/index.html';
});

// 删除
function cartRemove() {
	$('.delete-wrapper>.float-wrapper>a>span').click(function() {
		if(!confirm('确定删除么?')) return;
		var $sst = $(this);
		$.$myajax({
			url: '/cart/remove',
			type:'post',
			data: { ids: JSON.stringify([$(this).parent().parent().attr('data-id')]) },
			headers: { 'Authorization':sessionStorage.getItem('token')},
		})
		.then(function(result) {
			if(result.status === 200) {
				tips('删除成功');
				$sst.parent().parent().parent().remove();
				if($('ul>li').length === 0)
					$('.container').toggleClass('show');
				// 删除成功则刷新页面,避免剩余的单选正好可以联动起全选的情况
				window.location.reload();
			}else alert(result.message);
		});
	});
}