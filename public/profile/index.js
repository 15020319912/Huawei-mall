var name = sessionStorage.getItem('name');	//从sessionStorage中获取的用户

if(name === 'null') {
	$(".head").attr("src", '../images/profile/head-w.png');
	$('.content-wrapper>.userinfo>.content>span>a').text(登录/注册);
} else {
	$(".head").attr("src", '../images/profile/head.jpg');
	$('.content-wrapper>.userinfo>.content>span>a').text(name);
	
}