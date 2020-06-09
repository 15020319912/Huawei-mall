
//验证账号密码是否为空
$('.required').on('blur', function() {
	if($(this).val().trim().length === 0) {
		$(this).next().text($(this).attr('data-required-message'));
	} else {
		$(this).next().text('');
	}
	
});


$('input.btn-login').on('click', function() {
	//事件模拟触发相关表单元素的事件
	$('input.name, input.pwd').trigger('blur');
	//如果有错，直接rutern不发送登陆请求
	if($('span.error:not(:empty)').length > 0) rutern;
	$.$myAjax({
		url: '/user/login/pwd',
		type: 'post',
		data: { 
			name: $('.name').val(),
			pwd: $('.pwd').val(),
		}
	})
	.then(function(data) {
		//1. 将令牌保存起来（以备后续使用）
		sessionStorage.setItem('token', data);
		//2. 还有没有什么信息是登录以后要用的，但是现在要赶紧藏
		sessionStorage.setItem('name', $('.name').val());
		//3.跳转到该去的页面（不希望后退回来，使用replace函数完成跳转）
		window.location.replace(sessionStorage.getItem('target') || '/category/index.html');
	});
});
