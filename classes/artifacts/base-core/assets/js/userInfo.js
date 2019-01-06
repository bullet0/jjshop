$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/base-core/authority/userInfo.action', //j5
		async: true,
		dataType: 'json',
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			var msg = result.body.uUsername;
			$('.user_name').html(msg);
			var storeUp = {
				'name': result.body.uUsername,
				'id'  : result.body.uPkId,
			};
			sessionStorage.setItem('key', JSON.stringify(storeUp));
		},
		error: function() {
			$('.user_name').html();
		}
	});	
	//console.log(JSON.parse(sessionStorage.getItem('key')).name);
	//console.log(JSON.parse(sessionStorage.getItem('key')).id);
});

//状态码判断
function isState(code) {
	if(code == 401) {
		window.location.href = "/base-core/pages/index.html";
		return false;
	} else if(code == 403) {
		window.location.href = "/base-core/pages/403.html";
		return false;
	} else {
		return true;
	}
}