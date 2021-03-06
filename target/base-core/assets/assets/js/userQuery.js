$(document).ready(function() {
	$.ajax({
		type: 'get',
		url: '/base-core/authority/userInfo.action', //接口5：获取当前用户信息
		async: true,
		dataType: 'json',
		success: function(result) {
			var msg = result.body;
			$('tbody').append(
				'<tr>' +
				'<td class="username">' + msg.uUsername + '</td>' +
				'<td class="realName">' + msg.uPhone + '</td>' +
				'<td class="userRole">' + msg.uEmail + '</td>' +
				'<td>' + msg.uCreateTime + '</td>' +
				'<td>' +
				'<div class="hidden-sm hidden-xs btn-group">' +
				'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#user-form-div">' +
				'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
				'</button>' +
				'</div>' +
				'</td>' +
				'</tr>'
			);
			//表单值
			$('#form-add-username').val(msg.uUsername);
			$('#form-add-tel').val(msg.uPhone);
			$('#form-add-email').val(msg.uEmail);
			$('#form-add-ctime').val(msg.uCreateTime);
		}
	});
	//获取id
	var n = JSON.parse(localStorage.getItem('key')).id;
	$('.role-submit').on('click', function() {
		$.ajax({
			type:"get",
			url:"/base-core/authority/user/n.action", ///base-core/authority/user/{uId}.action   端口6修改当前用户信息
			async:true,
			date: {
				'uUsername' : $('#form-add-username').val(),
				'uPhone' : $('#form-add-tel').val(),
				'uEmail' : $('#form-add-email').val()
			},
			success: function(msg){
				if(msg.state == "200"){
					showTips('用户状态修改成功');
					$("#user-form-div").modal("hide");
				}else{
					showTips('请您稍后重试');
					$("#user-form-div").modal("hide");
				}
			}
		});
	})
});
//提示框

function showTips(content) {
	$("#op-tips-content").html(content);
	$("#op-tips-dialog").modal("show");
}