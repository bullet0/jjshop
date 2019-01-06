$(document).ready(function() {
	var n = JSON.parse(localStorage.getItem('key')).id;
	$.ajax({
		type: 'get',
		url: '/base-core/authority/role/n.action', //接口2：根据用户ID获取用户角色接口
		async: true,
		dataType: 'json',
		success: function(result) {
			var msg = result.body;
			for(var i in msg) {
				$('tbody').append(
					'<tr>' +
					'<td class="username">' + JSON.parse(localStorage.getItem('key')).name + '</td>' +
					'<td>'+ msg[i].rName +'</td>' +
					'<td>'+ msg[i].rRemark +'</td>' +
					'<td>'+ msg[i].permissions +'</td>' +
					'</tr>'
				)
			};
		}
	});
});