$(document).ready(function() {
	$.ajax({
		type: "get", //j13+
		url: "/base-core/authority/permissionsByPage.action",
		async: true,
		dataType: 'json',
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			//分页代码
			var currentPage = result.body.curPage;
			var totalPage = result.body.totalPage;
			var totalCount = result.body.totalCount;
			initPagination(totalPage); //分页
			$('tbody').html("");
			for(var i in result.body) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" onclick="checkOne(this)" class="ace" name="permIds" value=" ' + (parseFloat(i) + 1) + '"/>' +
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
			//初始化分页栏
			function initPagination(totalPage) {
				//$('#pagination').html("");
				$("#pagination ul").append(
					'<li><a href="javascript:void(0);" id="one" onclick="/base-core/authority/permissionsByPage.action">首页</a>'
				)
				for(var i = 1; i <= totalPage; i++) {
					$("#pagination ul").append(
						'<li id="page' + i + '"><a href="javascript:void(0);"  onclick="/base-core/authority/permissionsByPage.action">' + i + '</a>'
					)
				}
				$("#pagination ul").append(
					'<li><a href="javascript:void(0);" id="two" onclick="/base-core/authority/permissionsByPage.action">末页</a>'
				)
				$('.msg').html('当前第' + currentPage + '页，共' + totalPage + '页，共' + totalCount + '条记录')
				$("#page1").addClass("active");
				checkA();
			}

			function checkA() {
				currentPage == 1 ? $("#one").addClass("btn btn-default disabled") : $("#one").removeClass("btn btn-default disabled");
				currentPage == totalPage ? $("#two").addClass("disabled btn btn-default") : $("#two").removeClass("disabled btn btn-default");
			}
		}
	});

	//模糊查询
	$(".searchbtn").click(function() {
		var text = $('#rSearch').val(); //获取文本框输入
		if($.trim(text) != "" && istext()) {
			$('tbody').html(""); //删除
			$.ajax({
				type: "get", //数据展示
				url: "/base-core/authority/permissionsByPage.action", //j13+
				async: true,
				dataType: 'json',
				data: {
					'condition': text,
					'curPage': 1
				},
				success: function(result) {
					//状态
					if(isState(result.state)) {
						true;
					} else {
						return false;
					}
					for(var i in result.body) {
						$('tbody').append(
							'<tr>' +
							'<td class="center">' +
							'<label class="pos-rel">' +
							'<input type="checkbox" onclick="checkOne(this)" class="ace" name="permIds" value=" ' + (parseFloat(i) + 1) + '"/>' +
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
		} else {
			$("tbody tr").show(); //当删除文本框的内容时，又重新显示表格所有内容
		}
	});
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

function checkOne(v) {
	var objs = $("input[name=permIds]");
	for(var i = 0; i < objs.length; i++) {
		if(!objs[i].checked) {
			$("#chooseAll").prop("checked", false);
			return;
		}
	}
	$("#chooseAll").prop("checked", true)

}

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
	var id = b.find('b').html();
	var tds = $(this).parents('tr').children();
	var name = tds.eq(1).text();
	var url = tds.eq(2).text();
	$('#nameInput').val(name);
	$('#urlInput').val(url);
	//取值//赋值
	$("#perm-form-div").data({
		"tds": tds
	})
	//修改权限
	$('.role-true').on('click', function() {
		var name = $('#nameInput').val();
		var url = $('#urlInput').val();
		var tds = $('#perm-form-div').data('tds');
		if($('#nameInput').val() == '') {
			showTips('角色名称不能为空');
			return false;
		} else {
			if(isSpecial($('#nameInput').val())) {
				true
			} else {
				return false;
			}
		};
		if($('#urlInput').val() == '') {
			showTips('角色描述不能为空');
			return false;
		} else {
			true;
		};
		$.ajax({
			type: "put",
			url: "/base-core/authority/permission/" + id + ".action", //j15
			async: true,
			dataType: "json",
			data: JSON.stringify({
				'pUrl': $('#urlInput').val(),
				'pRemark': $('#nameInput').val()
			}),
			contentType: "application/json; charset=utf-8",
			success: function(result) {
				//状态
				if(isState(result.state)) {
					true;
				} else {
					return false;
				}
				var msg = result.state;
				if(msg == '200') {
					tds.eq(1).text(name);
					tds.eq(2).text(url);
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
			url: '/base-core/authority/permission/' + id + '.action', //j16
			async: true,
			success: function(result) {
				//状态
				if(isState(result.state)) {
					true;
				} else {
					return false;
				}
				var msg = result.state;
				if(msg == '200') {
					$('tbody').html("");
					addForm();
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
	if($('#nameInput').val() == '') {
		showTips('角色名称不能为空');
		return false;
	} else {
		if(isSpecial($('#nameInput').val())) {
			true
		} else {
			return false;
		}
	};
	if($('#urlInput').val() == '') {
		showTips('角色描述不能为空');
		return false;
	} else {
		if(isSpecial($('#urlInput').val())) {
			true
		} else {
			return false;
		}
	};
	$.ajax({
		type: "post",
		url: "/base-core/authority/permission.action", //j14
		async: true,
		dataType: "json",
		data: JSON.stringify({
			'pUrl': $('#nameInput').val(),
			'pRemark': $('#urlInput').val()
		}),
		contentType: "application/json; charset=utf-8",
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			var msg = result.state;
			if(msg == '200') {
				$('tbody').html("");
				addForm();
				showTips("添加成功");
				$("#perm-form-div").modal("hide");
			} else {
				showTips("稍后重试");
				$("#perm-form-div").modal("hide");
			}
		}
	});
})
//不能为特殊字符
function istext() {
	var msg = $('#rSearch').val();
	if(!/^([\u4e00-\u9fa5A-Za-z0-9,.?!;，。？！、；])*$/.test(msg)) {
		showTips("不能输入特殊字符");
		return false;
	} else {
		return true;
	}
}
//改写检测为特殊字符
function isSpecial(obj) {
	if(!/^([\u4e00-\u9fa5A-Za-z0-9,.?!;，。？！、；])*$/.test(obj)) {
		showTips("不能输入特殊字符");
		return false;
	} else {
		return true;
	}
}
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
//批量删除
$('.deleteAll').click(function() {
	var ids = $("input[type=checkbox]:checked");
	if(ids.length == 0) {
		showTips('未选中数据！');
	} else {
		$("input[type=checkbox]:checked").each(function() {
			var obj = {};
			obj.pPkId = this.value;
			n.push(obj)
		})
		$.ajax({
			type: "delete",
			url: "/base-core/authority/permissions.action",
			async: false,
			dataType: "json",
			data: JSON.stringify({
				n
			}),
			contentType: "application/json; charset=utf-8",
			success: function(result) {
				//状态
				if(isState(result.state)) {
					true;
				} else {
					return false;
				}
				if(result.state == 200) {
					$('tbody').html("");
					addForm();
					showTips('删除成功！');
				} else {
					showTips('请稍后再试');
				}
			}
		});
	}
})
//添加
function addForm() {
	$.ajax({
		type: "get", //数据展示
		url: "f.json",
		async: true,
		dataType: 'json',
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			for(var i in result.body) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" onclick="checkOne(this)" class="ace" name="permIds" value=" ' + (parseFloat(i) + 1) + '"/>' +
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
}