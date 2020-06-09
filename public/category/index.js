function bindEvent() {
	$('ul.category-main>li').on('click', function() {
		// 1. 判断当前被点的是不是已经激活的
		if($(this).hasClass('active')) return;
		// 2. 一级分类active切换
		$(this).addClass('active').siblings().removeClass('active');
		// 3. 将right中上一个分类的数据清空
		$('.right').empty();
		// 4. 动态创建img并显示最新一级分类对应avatar图片
		$('<img class="avatar" alt="" />').attr('src', $(this).attr('data-avatar')).appendTo('.right');	
		// 5. 发送ajax数据请求二级分类的数据，并动态展示
		$.$myAjax({
			url: '/category/list/' + $(this).attr('data-id'),
			type: 'get'
		})
		.then(function(data) {
			data.forEach(function(item) {
				var $categorySubWrapper = $(`
					<div class='category-sub-wrapper'>
						<h3>${item.name}</h3>
					</div>
				`);
				$categorySubWrapper.appendTo('.right');
				var $categorySub = $('<ul class="category-sub clearfix"></ul>');
				// 6. 发送ajax数据请求三级分类的数据，并动态展示
				$.$myAjax({
					url: '/category/list/' + item.id,
					type: 'get'
				})
				.then(function(data) {
					data.forEach(function(item) {
						$(`
							<li>
								<a href='/list/index.html?cid=${item.id}'>
									<img src='${item.avatar}' />
									<span>${item.name}</span>
								</a>
							</li>
						`).appendTo($categorySub);
					});
				});
				$categorySub.appendTo($categorySubWrapper);
			});
		});
	});
}

// 发送ajax请求,请求所有一级分类数据
$.$myAjax({
	url: '/category/list/0',
	type: 'get'
})
.then(function(data) {
	// 根据返回的一级分类数据动态创建li进行展示
	data.forEach(function(item) {
		$(`
			<li data-avatar='${item.avatar}' data-id='${item.id}'>
				<a>${item.name}</a>
			</li>
		`).appendTo('ul.category-main');
	});
	// 给刚刚动态生成的一级分类的li动态绑定点击事件
	bindEvent(); 
	// '事件模拟'一级分类的第一项被点击了
	$('ul.category-main>li').eq(0).trigger('click');
});


