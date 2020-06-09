
var url = window.location.href;
var aaa = url.slice(url.indexOf('=') + 4);
console.log(aaa);
//拿取订单的总金额
$.$myAjax({
	url: '/order/account/' + aaa,
	type: 'get',
	headers: { 
		'Authorization': sessionStorage.getItem("token"),
	}
})
.then(function(data) {
	$('.pr2').text("￥" + data + ".00");
});

//
$.$myAjax({
	url: '/order/pay/' + aaa,
	type: 'get',
	headers: { 
		'Authorization': sessionStorage.getItem("token"),
	}
})
.then(function(data) {

});



//倒计时
var maxtime = 60*60 //一个小时,按照秒算
timer = setInterval("CountDown()",1000);
function CountDown() {
	if(maxtime >= 0) {
		minutes = Math.floor(maxtime/60);
		seconds = Math.floor(maxtime%60);
		msg = '请您在' + minutes + '分' + seconds + '秒内完成支付';
		document.all["timer"].innerHTML=msg;
		--maxtime;
	} else {
		clearInterval(timer);
		console.log("结束");
	}
}