var name = sessionStorage.getItem('name');	//从sessionStorage中获取的用户

if(name === 'null') {
	$('.home>.header>.sou>.login').text('登录');
} else {
	$('.home>.header>.sou>.login').text(name);
}