$(document).ready(function() {

	$.ajax({
		url: '/base-core/authority/roles.action', //j1
		dataType: 'json',
		type: 'GET',
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
			var msg = result.body.list;
			for(var i in msg) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" onclick="checkOne(this)" class="ace" name="roleIdss" value="' + msg[i].rPkId + '"/>' +
					'<span class="lbl"></span>' +
					'<b>' + (parseFloat(i) + 1) + '</b>' +
					'</label>' +
					'</td>' +
					'<td class="name">' + msg[i].rName + '</td>' +
					'<td class="description">' + msg[i].rRemark + '</td>' +
					'<td>' +
					'<a href="javascript:void(0);" class="show-role-perms" txt="' + msg[i].permissions + '">点击查看</a>' +
					'</td>' +
					'<td>' +
					'<div class="hidden-sm hidden-xs btn-group">' +
					'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#role-form-xiugai">' +
					'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-warning accredit" data-toggle="modal" data-target="#role-form-squan">' +
					'<i class="ace-icon fa fa-users bigger-120" title="授权"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-danger delete" data-toggle="modal" data-target="#delete-confirm-dialog">' +
					'<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>' +
					'</button>' +
					'</div>' +
					'</td>' +
					'</tr>'
				);
			};
			//点击查看
			$(".role-list").on("click", ".show-role-perms", function() {
				var uId = $(this).attr("txt");
				var txt = '';
				$.ajax({
					type: "get",
					url: "/base-core/authority/permissions/role/" + uId + ".action", //接口7
					async: false,
					success: function(result) {
						console.log(result)
						var num = result.body;
						for(var i in num) {
							txt = txt + num[i].pRemark + '<br>'
						}						
					}
				});
				$(this).parent('td').html(txt)
			});
			//初始化分页栏
			function initPagination(totalPage) {
				//$('#pagination').html("");
				$("#pagination ul").append(
					'<li><a href="javascript:void(0);" id="one" onclick="/base-core/authority/roles.action">首页</a>'
				)
				for(var i = 1; i <= totalPage; i++) {
					$("#pagination ul").append(
						'<li id="page' + i + '"><a href="javascript:void(0);"  onclick="/base-core/authority/roles.action">' + i + '</a>'
					)
				}
				$("#pagination ul").append(
					'<li><a href="javascript:void(0);" id="two" onclick="/base-core/authority/roles.action">末页</a>'
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

	getting(); //追加权限列表

	//模糊查询
	$(".searchbtn").click(function() {
		var text = $('#rSearch').val(); //获取文本框输入
		if($.trim(text) != "" && istext()) {
			$('tbody').html(""); //删除
			$.ajax({
				type: "get",
				url: "/base-core/authority/roles.action", //j1
				async: true,
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
					var msg = result.body.list;
					for(var i in msg) {
						$('tbody').append(
							'<tr>' +
							'<td class="center">' +
							'<label class="pos-rel">' +
							'<input type="checkbox" onclick="checkOne(this)" class="ace" name="roleIdss" value="' + msg[i].rPkId + '"/>' +
							'<span class="lbl"></span>' +
							'<b>' + (parseFloat(i) + 1) + '</b>' +
							'</label>' +
							'</td>' +
							'<td class="name">' + msg[i].rName + '</td>' +
							'<td class="description">' + msg[i].rRemark + '</td>' +
							'<td>' +
							'<a href="javascript:void(0);" class="show-role-perms" txt="' + msg[i].permissions + '">点击查看</a>' +
							'</td>' +
							'<td>' +
							'<div class="hidden-sm hidden-xs btn-group">' +
							'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#role-form-xiugai">' +
							'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
							'</button>' +
							'</button>' +
							'<button class="btn btn-xs btn-warning show-update-form" data-toggle="modal" data-target="#role-form-squan">' +
							'<i class="ace-icon fa fa-users bigger-120" title="授权"></i>' +
							'</button>' +
							'<button class="btn btn-xs btn-danger delete" data-toggle="modal" data-target="#delete-confirm-dialog">' +
							'<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>' +
							'</button>' +
							'</div>' +
							'</td>' +
							'</tr>'
						);
					};
					//点击查看
					$(".role-list").on("click", ".show-role-perms", function() {
						$(this).parent('td').html($(this).attr("txt"));
					});
				},
			});
		} else {
			$("tbody tr").show(); //当删除文本框的内容时，又重新显示表格所有内容
		}
	});
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

function checkOne(v) {
	var objs = $("input[name=roleIdss]");
	console.log(objs)
	for(var i = 0; i < objs.length; i++) {
		if(!objs[i].checked) {
			$("#chooseAll").prop("checked", false);
			return;
		}
	}
	$("#chooseAll").prop("checked", true)

}

//修改角色
$(".role-list").on("click", ".show-update-form", function() {
	var b = $(this).parents('tr');
	var id = b.find('b').html();
	var tds = $(this).parents('tr').children();
	var name = tds.eq(1).text();
	var descript = tds.eq(2).text();
	$('#nameInput1').val(name);
	$('#descriptionInput1').val(descript);
	//取值//赋值
	$("#role-form-xiugai").data({
		"tds": tds
	})
	//修改角色
	$('.role-true').on('click', function() {
		console.log(tds);
		var name = $('#nameInput1').val();
		var descript = $('#descriptionInput1').val();
		var tds = $('#role-form-xiugai').data('tds');
		if($('#nameInput1').val() == '') {
			showTips('角色名称不能为空');
			return false;
		} else {
			if(isSpecial($('#nameInput1').val())) {
				true
			} else {
				return false;
			}
		};
		if($('#descriptionInput1').val() == '') {
			showTips('角色描述不能为空');
			return false;
		} else {
			if(isSpecial($('#descriptionInput1').val())) {
				true
			} else {
				return false;
			}
		};
		$.ajax({
			type: "post",
			url: "/base-core/authority/role/" + id + ".action", //j9
			async: true,
			dataType: "json",
			data: JSON.stringify({
				'rName': $('#nameInput1').val(),
				'rRemark': $('#descriptionInput1').val()
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
					tds.eq(2).text(descript);
					showTips('角色信息修改成功');
					$("#role-form-xiugai").modal("hide");
				} else {
					showTips('请您稍后重试');
					$("#role-form-xiugai").modal("hide");
				}
			}
		});
	})
});
//角色授权
$(".role-list").on("click", ".accredit", function() {
	var b = $(this).parents('tr');
	var id = b.find('.ace').val();
	console.log(id);
	var ids = [];
	$.ajax({
		type: "get",
		url: "/base-core/authority/permissions/role/" + id + ".action", //j7
		async: true,
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			console.log(result)
			var message = result.body;
			for(var i in message) {
				ids[i] = message[i].pPkId;
			}
			console.log(ids.length)
			var objs = $("input[name=roleIdsi]");
			console.log(objs)
			$("input[name=roleIdsi]").each(function() {
				for(var n = 0; n < ids.length; n++) {
					if(ids[n] == $(this).val()) {
						$(this).prop("checked", true);
					}
				}
			})
			console.log($('input[name=roleIdsi]:checked'))
		}
	});
	//点击提交
	$('.role-qxian').on('click', function() {
		var permissions = [];
		console.log($('input[name=roleIdsi]:checked'))
		$('input[name=roleIdsi]:checked').each(function() {
			var obj = {};
			obj.pPkId = this.value;
			permissions.push(obj);
		})

		$.ajax({
			type: "put",
			url: "/base-core/authority/role/permissions/" + id + ".action", //j11
			async: true,
			dataType: "json",
			data: JSON.stringify({
				permissions
			}),
			contentType: "application/json; charset=utf-8",
			success: function(msg) {
				//状态
				if(isState(msg.state)) {
					true;
				} else {
					return false;
				}
				if(msg.state == "200") {
					showTips('用户角色授权成功');
					$("#role-form-squan").modal("hide");
				} else {
					showTips('请您稍后重试');
					$("#role-form-squan").modal("hide");
				}
			}
		});
	});
})
//删除角色
$(".role-list").on("click", ".delete", function() {
	var b = $(this).parents('tr');
	var id = b.find('input').val();
	$('.delete-selected-confirm').click(function() {
		$.ajax({
			type: 'delete',
			url: '/base-core/authority/role/' + id + '.action', //j10
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
		url: "/base-core/authority/permissions.action", //j13
		async: true,
		success: function(resule) {
			//状态
			if(isState(resule.state)) {
				true;
			} else {
				return false;
			}
			var myName = resule.body;
			console.log(myName)
			for(var i in myName) {
				$('.property-div').append(
					'<label>' +
					'<input class="ace" type="checkbox" name="roleIdsi" value="' + (parseFloat(i) + 1) + '">' +
					'<span class="lbl">' + myName[i].pRemark + '</span>' +
					'</label><br>'
				)
			}
		},
	});
};
//提交添加
$('.role-submit').on('click', function() {
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
	if($('#descriptionInput').val() == '') {
		showTips('角色描述不能为空');
		return false;
	} else {
		if(isSpecial($('#descriptionInput').val())) {
			true
		} else {
			return false;
		}
	};
	$.ajax({
		type: "post", //post:测试用get
		url: "/base-core/authority/role.action", //j8
		async: true,
		dataType: "json",
		data: JSON.stringify({
			'rName': $('#nameInput').val(),
			'rRemark': $('#descriptionInput').val()
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
//不能为特殊字符
function istext() {
	var msg = $('#rSearch').val();
	if(!/^([\u4e00-\u9fa5A-Za-z0-9,.?!;，。？！、；])*$/.test(msg)) {
		showTips("不能输入特殊字符");
		return false;
	} else {
		return true;
	}
};
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
	var ids = $("input[name=roleIdss]:checked");
	var n = [];
	if(ids.length == 0) {
		showTips('未选中数据！');
	} else {
		$("input[type=checkbox]:checked").each(function() {
			var obj = {};
			obj.rPkId = this.value;
			n.push(obj)
		})
		$.ajax({
			type: "delete",
			url: "/base-core/authority/roles.action",
			async: false,
			dataType: "json",
			data: JSON.stringify({
				n /////////////////////////////////////////////////////////////////////////////////////////////////
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
					ids.parents('tr').remove();
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
		url: '/base-core/authority/role.action',
		dataType: 'json',
		type: 'POST',
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			var msg = result.body.list;
			for(var i in msg) {
				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel">' +
					'<input type="checkbox" onclick="checkOne(this)" class="ace" name="roleIdss" value="' + msg[i].rPkId + '"/>' +
					'<span class="lbl"></span>' +
					'<b>' + (parseFloat(i) + 1) + '</b>' +
					'</label>' +
					'</td>' +
					'<td class="name">' + msg[i].rName + '</td>' +
					'<td class="description">' + msg[i].rRemark + '</td>' +
					'<td>' +
					'<a href="javascript:void(0);" class="show-role-perms" txt="' + msg[i].permissions + '">点击查看</a>' +
					'</td>' +
					'<td>' +
					'<div class="hidden-sm hidden-xs btn-group">' +
					'<button class="btn btn-xs btn-info show-update-form" data-toggle="modal" data-target="#role-form-xiugai">' +
					'<i class="ace-icon fa fa-pencil bigger-120" title="修改"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-warning accredit" data-toggle="modal" data-target="#role-form-squan">' +
					'<i class="ace-icon fa fa-users bigger-120" title="授权"></i>' +
					'</button>' +
					'<button class="btn btn-xs btn-danger delete" data-toggle="modal" data-target="#delete-confirm-dialog">' +
					'<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>' +
					'</button>' +
					'</div>' +
					'</td>' +
					'</tr>'
				);
			};
		}
	})
}