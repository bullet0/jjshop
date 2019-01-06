$(document).ready(function() {
	$.ajax({
		type: "get", //数据展示
		url: "/base-core/authority/permissions.action",  //端口13
		async: true,
		dataType: 'json',
		success: function(result) {
			for(var i in result.body) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" class="ace" name="permIds" value=" ' + result.body[i].pPkId + '"/>' +
					'<span class="lbl"></span>' +
					'<b>' + (parseFloat(i) + 1) + '</b>' +
					'</label>' +
					'</td>' +
					'<td class="name">' + result.body[i].pRemark + '</td>' +
					'<td class="url">' + result.body[i].pUrl + '</td>' +
					'<td>' +
					'<div class="hidden-sm hidden-xs btn-group">' +
					'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#perm-form-div">' +
					'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-danger delete" data-toggle="modal" data-target="#delete-confirm-dialog">' +
					'<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>' +
					'</button>' +
					'</div>' +
					'</td>' +
					'</tr>'
				)
			};
		}
	});
	//模糊查询
	var text = "";
	//实时筛选，不用点击按钮
	setInterval(function() {
		text = $('#rSearch').val(); //获取文本框输入
		if($.trim(text) != "") {
			$("tbody tr").hide().filter(":contains('" + text + "')").show();
		} else {
			$("tbody tr").show(); //当删除文本框的内容时，又重新显示表格所有内容
		}
	}, 100);
})
//全选
$(document).on('click', 'th input:checkbox', function() {
	var that = this;
	$(this).closest('table').find('tr > td:first-child input:checkbox')
		.each(function() {
			this.checked = that.checked;
			$(this).closest('tr').toggleClass('selected');
		});
});
function showTips(content) {
	$("#op-tips-content").html(content);
	$("#op-tips-dialog").modal("show");
}
//重置角色表单
function resetRoleForm(title, button) {
	$(".perm-form input[type='text']").val("");
	$(".perm-form-title").html(title);
	$(".perm-submit").html('<i class="ace-icon fa fa-check"></i>' + button);
}
//添加权限
$(".add-form").on("click", function() {
	resetRoleForm("添加新权限", "添加");
	$('.role-true').hide();
	$('.perm-submit').show();
});
//编辑权限
$(".perm-list").on("click", ".show-update-form", function() {
	resetRoleForm("修改权限信息", "确定");
	$('.perm-submit').hide();
	$('.role-true').show();
	var b = $(this).parents('tr');
	var id = b.find('input').val();
	var name = b.children('.name').html();
	var url = b.children('.url').html();
	$('#nameInput').val(name);
	$('#urlInput').val(url);
	//修改权限
	$('.role-true').on('click', function() {
		$.ajax({
			type: "get", //post:测试用get
			url: "/base-core/authority/permission/id.action", //接口15：权限修改
			async: true,
			date: {
				'pUrl': $('#urlInput').val(),
				'pRemark': $('#nameInput').val()
			},
			success: function(result) {
				var msg = result.state;
				if(msg == '200') {
					showTips('权限信息修改成功');
					$("#perm-form-div").modal("hide");
				} else {
					showTips('请您稍后重试');
					$("#perm-form-div").modal("hide");
				}
			}
		})
	});
});
//删除权限
$(".perm-list").on("click", ".delete", function() {
	var b = $(this).parents('tr');
	var id = b.find('input').val();
	$('.delete-selected-confirm').click(function() {
		$("#delete-confirm-dialog").modal("hide");
		$.ajax({
			type: 'delete',
			url: '/base-core/authority/role/id.action', //端口10：角色删除
			async: true,
			success: function(result) {
				var msg = result.state;
				if(msg == '200') {
					showTips("角色删除成功");
					$("#delete-confirm-dialog").modal("hide");
				} else {

				};
			},
			error: function() {

			}
		});
	})

})
//添加
$('.perm-submit').on('click', function() {
	$.ajax({
		type: "get", //post:测试用get
		url: "/base-core/authority/permission.action", //接口14：权限添加
		async: true,
		date: {
			'pUrl': $('#nameInput').val(),
			'pRemark': $('#urlInput').val()
		},
		success: function(result) {
			var msg = result.state;
			if(msg == '200') {
				showTips("添加成功");
				$("#perm-form-div").modal("hide");
			} else {
				showTips("稍后重试");
				$("#perm-form-div").modal("hide");
			}
		}
	});
})