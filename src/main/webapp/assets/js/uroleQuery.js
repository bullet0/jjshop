$(document).ready(function() {
	var n = JSON.parse(localStorage.getItem('key')).id;
	$.ajax({
		type: 'get',
		url: '/base-core/authority/role/' + n + '.action', //接口2：根据用户ID获取用户角色接口
		async: true,
		dataType: 'json',
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			var msg = result.body;
			for(var i in msg) {
				$('tbody').append(
					'<tr>' +
					'<td class="username">' + JSON.parse(localStorage.getItem('key')).name + '</td>' +
					'<td>' + msg[i].rName + '</td>' +
					'<td>' + msg[i].rRemark + '</td>' +
					'<td>' +
					'<a href="javascript:void(0);" class="show-property" n="' + msg[i].rPkId + '">点击查看</a>' +
					'</td>' +
					'</tr>'
				)
			};
		}
	});
	$(".role-list").on("click", ".show-property", function() {
		var id = $(this).attr('n');
		var msg = '';
		$.ajax({
			type: "get",
			url: "/base-core/authority/permissions/role/" + id + ".action", //接口7
			async: false,
			success: function(result) {
				//状态
				if(isState(result.state)) {
					true;
				} else {
					return false;
				}
				var obj = result.body;
				console.log(obj);
				for(var i in obj) {
					msg = msg + obj[i].pRemark + '<br>';
				}
			}
		});
		$(this).parent('td').html(msg);
	});
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