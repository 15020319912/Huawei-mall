
var validForm = $(".demoform").Validform({
	tiptype: 3
});
$('.btn-login').on('click', function() {
	if(validForm.check()) {
		$.$myAjax({
			url: '/user/register',
			type: 'post',
			data: { 
				name: $('.name').val(),
				pwd: $('.pwd').val(),
				phone: $('.phone').val()
			}
		})
		.then(function(data) {
			
		});
	}
	
})
