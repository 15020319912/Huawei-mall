var name = sessionStorage.getItem('name');
console.log(name);
if(name !== 'null') { // 如果登录
	$.$myAjax({
		url: '/address/list',
		type: 'post',
		headers: { 
			'Authorization': sessionStorage.getItem("token"),
		}
	})
	.then(function(data) {
		data.forEach(function(item) {
			$(`
				<div class="item" data-id="${item.id}">
					<div class="top">
						<p class="p-name">
							<span class="i-name">${item.receiveName}</span>
							<em class="i-phone">${item.receivePhone}</em>
						</p>
						<p class="p-address">
							<span class="i-region">${item.receiveRegion}</span>
							<span class="i-detail">${item.receiveDetail}</span>
						</p>
					</div>
					<div class="bottom clearfix">
						<span>
							<i class="${item.isDefault === 1 ? 'check2' : 'check1'}"></i>
							<span>默认地址</span>
						</span>
						<div href="#" class="delete">
							<i></i>
							<span>删除</span>
						</div>
						<a href="#" class="edit">
							<i></i>
							<span>编辑</span>
						</a>
						
					</div>
				</div>
			`).appendTo('.content');
		});
	});
} else { // 如果没登录
	window.location.replace('../login/index.html');
}

$('.content').on('click', '.bottom>span', function() {
	$(this).find('i').toggleClass('check2').toggleClass('check1');
	
});



//新增地址
$('.add').on('click', function() {
	$('.address-wrapper').css('display','none');
	$('.add-wrapper').css('display','block');
});

// 保存新增
$('.confirm').on('click', function() {
	if(validForm.check()) {
		$('.address-wrapper').css('display','block');
		$('.add-wrapper').css('display','none');
		$.$myAjax({
			url: '/address/add',
			type: 'post',
			data: { jsonStr: JSON.stringify({ 
				receiveName: $('.receiveName').val(),
				receivePhone: $('.receivePhone').val(),
				receiveRegion: $('.receiveRegion').val(),
				receiveDetail: $('.receiveDetail').val()
			}) },
			
			headers: {
				'Authorization': sessionStorage.getItem("token"),
			}
		})
		.then(function(data) {
			
		});
	}
	
});
//取消新增

$('.cancel').on('click', function() {
	$('.address-wrapper').css('display','block');
	$('.add-wrapper').css('display','none');
});

//  修改地址
// 还需要将要修改的都放入文本框内，判断修改
setTimeout(function() {
	$('.content').on('click', '.edit', function() {
		$('.address-wrapper').css('display','none');
		$('.add-wrapper').css('display','block');
		var dataId = $(this).parent().parent().attr('data-id');
		$.$myAjax({
			url: '/address/update',
			type: 'post',
			data: { jsonStr: JSON.stringify({ 
				id: dataId,
				receiveName: $('.receiveName').val(),
				receivePhone: $('.receivePhone').val(),
				receiveRegion: $('.receiveRegion').val(),
				receiveDetail: $('.receiveDetail').val()
			}) },
			headers: { 
				'Authorization': sessionStorage.getItem("token"),
			}
		})
		.then(function(data) {
			$('.receiveName').val($('.i-name').text());
			$('.receivePhone').val($('.i-phone').text());
			$('.receiveRegion').val($('.i-region').text());
			$('.receiveDetail').val($('.i-detail').text());
		});
	});
}, 10);


// 删除操作
//还应该提示是否删除
$('.content').on('click', '.delete', function() {
	var dataId = $(this).parent().parent().attr('data-id');
	console.log(dataId);
	$.$myAjax({
		url: '/address/remove/' + dataId,
		type: 'get',
		headers: { 
			'Authorization': sessionStorage.getItem("token"), 
		}
	})
	.then(function() {});
});

//设为默认地址
//还应该给默认地址显示选中
$('.content').on('click', '.bottom>span', function() {
	var dataId = $(this).parent().parent().attr('data-id');
	console.log(dataId);
	$.$myAjax({
		url: '/address/default/' + dataId,
		type: 'get',
		headers: { 
			'Authorization': sessionStorage.getItem("token"), 
		}
	})
	.then(function() {});
});


// 判断当前页面是不是从订单确认页过来的，如果是，我们要给每个li绑定点击事件，可以跳回订单 页面，把地址带回去
// /orderConfirm/index.html
// 
// /orderConfirm/index.html?addressId=你选的地址id


// 如果是从订单确认页面过来的
if(document.referrer.indexOf('/orderConfirm/index') !== -1) {
	$('.content').on('click', '.item', function() {
		var id = $(this).attr('data-id');
		window.location.replace('/orderConfirm/index.html?addressId=' + id);
	});
	
}


var validForm = $(".demoform").Validform({
	tiptype: 3
});
