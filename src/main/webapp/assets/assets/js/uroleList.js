$(document).ready(function() {

	$.ajax({
		url: '/base-core/authority/roles.action',
		dataType: 'json',
		type: 'GET',
		success: function(result) {
			var msg = result.body.list;
			for(var i in msg) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" class="ace" name="roleIds" value="' + msg[i].rPkId + '"/>' +
					'<span class="lbl"></span>' +
					'<b>' + (parseFloat(i) + 1) + '</b>' +
					'</label>' +
					'</td>' +
					'<td class="name">' + msg[i].rName + '</td>' +
					'<td class="description">' + msg[i].rRemark + '</td>' +
					'<td>' +
					'<a href="javascript:void(0);" class="show-role-perms">点击查看</a>' +
					'</td>' +
					'<td>' +
					'<div class="hidden-sm hidden-xs btn-group">' +
					'<button class="btn btn-xs btn-inverse">' +
					'<i class="ace-icon fa fa-lock bigger-120" title="无权限"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#role-form-div">' +
					'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-danger delete" data-toggle="modal" data-target="#delete-confirm-dialog">' +
					'<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>' +
					'</button>' +
					'</div>' +
					'</td>' +
					'</tr>'
				)
			}
		}
	});

	getting(); //追加权限列表

	//模糊查询
	var text = "";
	//实时筛选，不用点击按钮
	setInterval(function() {
		text = $('#rSearch').val(); //获取文本框输入
		if($.trim(text) != "") {
			$("tbody tr").hide().filter(":contains('" + text + "')").show();
		} else {
			$('tbody tr').show(); //当删除文本框的内容时，又重新显示表格所有内容
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

// 重置角色表单
function resetRoleForm(title, button) {
	$(".role-form input[type='text']").val("");
	$(".role-form-title").html(title);
	$(".role-submit").html('<i class="ace-icon fa fa-check"></i>' + button);
}

//添加角色框体
$(".add-form").click(function() {
	$('.role-true').hide();
	$('.role-submit').show();
	resetRoleForm("添加新角色", "添加");
});
//修改角色
$(".role-list").on("click", ".show-update-form", function() {
	resetRoleForm("修改角色信息", "确定");
	$('.role-submit').hide();
	$('.role-true').show();
	var b = $(this).parents('tr');
	var id = b.find('input').val();
	var name = b.children('.name').html();
	var descript = b.children('.description').html();
	$('#nameInput').val(name);
	$('#descriptionInput').val(descript);
	//修改角色
	$('.role-true').on('click', function() {
		$.ajax({
			type: "get", //post:测试用get
			url: "/base-core/authority/role/id.action", //接口9：角色修改
			async: true,
			date: {
				'rName': $('#nameInput').val(),
				'rRemark': $('#descriptionInput').val()
			},
			success: function(result) {
				var msg = result.state;
				if(msg == '200') {
					showTips('角色信息修改成功');
					$("#role-form-div").modal("hide");
				} else {
					showTips('请您稍后重试');
					$("#role-form-div").modal("hide");
				}
			}
		});
	})
});
//删除角色
$(".role-list").on("click", ".delete", function() {
	var b = $(this).parents('tr');
	var id = b.find('input').val();
	$('.delete-selected-confirm').click(function() {
		$.ajax({
			type: 'delete',
			url: '/base-core/authority/role/id.action', //端口10：角色删除
			async: true,
			success: function(result) {
				var msg = result.state;
				if(msg == '200') {
					showTips('角色删除成功');
					$("#delete-confirm-dialog").modal("hide");
				} else {

				};
			},
			error: function() {

			}
		});
	});
})
//追加权限列表
function getting() {
	$.ajax({
		type: "get",
		url: "/base-core/authority/permissions.action", //接口13：查看所有权限
		async: true,
		success: function(resule) {
			var myName = resule.body;
			for(var i in myName) {
				$('.property-div').append(
					'<label>' +
					'<input class="ace" type="checkbox" name="roleIds" value="' + (parseFloat(i) + 1) + '">' +
					'<span class="lbl">' + myName[i].pRemark + '</span>' +
					'</label><br>'
				)
			}
		},
		error: function() {

		}
	});
};
//提交添加
$('.role-submit').on('click', function() {
	$.ajax({
		type: "get", //post:测试用get
		url: "/base-core/authority/role.action", //接口8：角色添加
		async: true,
		date: {
			'rName': $('#nameInput').val(),
			'rRemark': $('#descriptionInput').val()
		},
		success: function(result) {
			var msg = result.state;
			if(msg == '200') {
				showTips('新角色添加成功');
				$("#role-form-div").modal("hide");
			} else {
				showTips('请您稍后重试');
				$("#role-form-div").modal("hide");
			}
		}
	});
})

//提示框
function showTips(content) {
	$("#op-tips-content").html(content);
	$("#op-tips-dialog").modal("show");
}
    