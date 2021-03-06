$(document).ready(function() {

	$.ajax({
		type: 'GET',
		url: '/base-core/authority/users.action',
		async: true,
		dataType: 'json',
		success: function(result) {
			var msg = result.body.list;
			for(var i in msg) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" class="ace" name="userIds" value="' + (parseFloat(i) + 1) + '"/>' +
					'<span class="lbl"></span>' +
					'<b>' + (parseFloat(i) + 1) + '</b>' +
					'</label>' +
					'</td>' +
					'<td class="username">' + msg[i].uUsername + '</td>' +
					'<td class="userRole">用户角色</td>' +
					'<td class="realName">' + msg[i].uPhone + '</td>' +
					'<td class="userRole">' + msg[i].uEmail + '</td>' +
					'<td>' + msg[i].uCreateTime + '</td>' +
					'<td>' + msg[i].uLastTime + '</td>' +
					'<td><span class="label label-sm label-success user_state">' + msg[i].uState + '</span></td>' +
					'<td>' +
					'<div class="hidden-sm hidden-xs btn-group">' +
					'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#user-form-div">' +
					'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
					'</button>' +
					'</div>' +
					'</td>' +
					'</tr>'
				)
			};

			$('span.user_state').each(function() {
				if($(this).html() == 0) {
					$(this).html('禁用');
					$(this).addClass('label-warning');
				} else {
					$(this).html('正常');
				}
			})

		},
		error: function() {

		}
	});
	
	getting(); //填充用户角色

	//模糊查询
	var text = "";
	setInterval(function() {
		text = $('#rSearch').val(); //获取文本框输入
		if($.trim(text) != "") {
			$("tbody tr").hide().filter(":contains('" + text + "')").show();
		} else {
			$("tbody tr").show(); //当删除文本框的内容时，又重新显示表格所有内容
		}
	}, 100);

});

//全选
$(document).on('click', 'th input:checkbox', function() {
	var that = this;
	$(this).closest('table').find('tr > td:first-child input:checkbox')
		.each(function() {
			this.checked = that.checked;
			$(this).closest('tr').toggleClass('selected');
		});
});

//获取用户角色
function getting() {
	$.ajax({
		type: "get",
		url: "/base-core/authority/roles.action", //接口1：获取所有角色信息
		async: true,
		success: function(resule) {
			var myName = resule.body.list;
			for(var i in myName) {
				$('.roles-div').append(
					'<label>' +
					'<input class="ace" type="checkbox" name="roleIds" value="' + (parseFloat(i) + 1) + '">' +
					'<span class="lbl">' + myName[i].rName + '</span>' +
					'</label><br>'
				)
			}
		},
		error: function() {

		}
	});
};
//点击获取数据 
$(".user-list").on("click", ".show-update-form", function() {
	var b = $(this).parents('tr');
	var id = b.find('b').html();
	var name = b.children('.username').html();
	var state = b.find('.user_state').html();
	$('#form-add-username').val(name);
	if(state == '正常') {
		$('#state').find("input[value='1']").prop('checked', true);
		$('#state').find("input[value='2']").removeAttr('checked');
	} else if(state == '禁用') {
		$('#state').find("input[value='2']").prop('checked', true);
		$('#state').find("input[value='1']").removeAttr('checked');
	}
});
//点击提交数据
$('.role-submit').on('click', function() {
	$.ajax({
		type: "post",
		url: "/base-core/authority/user/{uId}.action", ///base-core/authority/user/{uId}.action   端口6修改当前用户信息
		async: true,
		date: {
			'uUsername': $('#form-add-username').val(),
			'uPhone': $('#form-add-tel').val(),
			'uEmail': $('#form-add-email').val()
		},
		success: function(msg) {
			if(msg.state == "200") {
				showTips('用户信息修改成功');
				$("#user-form-div").modal("hide");
			} else {
				showTips('请您稍后重试');
			}
		}
	});
});
//提示框
function showTips(content) {
	$("#op-tips-content").html(content);
	$("#op-tips-dialog").modal("show");
}