var path = $("#sysPath").text();

// 展示提示框
function showTips(content) {
	$("#op-tips-content").html(content);
	$("#op-tips-dialog").modal("show");
}

// 重置用户表单
function resetUserForm(title, button) {
	$(".user-form-title").html(title);
	$(".user-submit").html('<i class="ace-icon fa fa-check"></i>' + button);
	$(".user-form input[type='text']").val("");
	$(".user-form label[for='form-add-username']").show();
	$(".user-form input[name='username']").show();
	$(".user-form label[for='form-add-password']").show();
	$(".user-form input[name='password']").show();
	$(".user-form input[name='username']").prop("disabled", false);
	$(".user-form input[name='password']").prop("disabled", false);
	$(".user-form input[type='radio']").prop("checked", false);

}
// 获取所有角色
function getAllRoles(obj) {
	obj.html("");
	$.ajax({
		url: "listRoles.html",
		type: "POST",
		dataType: "json",
		async: false,
		success: function(data) {
			for(var i in data) {
				obj.append("<label><input class='ace' type='radio' name='roleIds' value='" +
					data[i].id + "'/><span class='lbl'>[" + data[i].name + "]-" + data[i].description);
				obj.append("</span></label><br>");
			}
		}
	});
}

// 根据用户名获取相应姓名、密码、状态
function getUserByUsername(username, doSuccess) {
	$.ajax({
		url: "getUser.html",
		data: {
			username: username
		},
		type: "POST",
		dataType: "json",
		success: function(data) {
			doSuccess(data);
		}
	});
}

// 根据用户名获取相应角色
function getRolesByUsername(username, doSuccess) {
	$.ajax({
		url: "showRoles.html",
		data: {
			username: username
		},
		type: "POST",
		dataType: "json",
		success: function(data) {
			doSuccess(data);
		}
	});
}

//添加用户框体
$(".show-add-form").click(function() {
	resetUserForm("添加新用户", "添加");
	$(".user-form input[type='radio'][name='state'][value='1']").prop("checked", true);
	getAllRoles($(".roles-div"));
});

// 更新用户框体
$(".user-list").on("click", ".show-update-form", function() {
	resetUserForm("更新用户信息", "更新");
	getAllRoles($(".roles-div"));
	var userId = $(this).parents("tr").find(".userId").html();
	$("input[name='id']").val(userId);
	var username = $(this).parents("tr").find(".username").html();
	$("input[name='username']").val(username);

	getUserByUsername(username, function(data) {
		$("input[name='username']").prop("disabled", true);
		$("label[for='form-add-username']").hide();
		$("input[name='username']").hide();
		$("input[name='password']").prop("disabled", true);
		$("label[for='form-add-password']").hide();
		$("input[name='password']").hide();

		$("input[name='realName']").val(data.realName);
		if(data.state === 0) {
			$(".user-form input[type='radio'][name='state']").prop("checked", false);
			$(".user-form input[type='radio'][name='state'][value='0']").prop("checked", true);
		} else if(data.state === 1) {
			$(".user-form input[type='radio'][name='state']").prop("checked", false);
			$(".user-form input[type='radio'][name='state'][value='1']").prop("checked", true);
		} else if(data.state === 2) {
			$(".user-form input[type='radio'][name='state']").prop("checked", false);
			$(".user-form input[type='radio'][name='state'][value='2']").prop("checked", true);
		} else {
			$(".user-form input[type='radio'][name='state']").prop("checked", false);
		}
	});

	// $.ajax({
	//     url:"getUser.html",
	//     data:{username:username},
	//     type:"POST",
	//     dataType:"json",
	//     success:function(data){
	//         $("input[name='password']").prop("disabled",true);
	//         $("input[name='realName']").val(data.realName);
	//         if(data.state===0){
	//             $(".user-form input[type='radio'][name='state']").prop("checked",false);
	//             $(".user-form input[type='radio'][name='state'][value='0']").prop("checked",true);
	//         }else if(data.state===1){
	//             $(".user-form input[type='radio'][name='state']").prop("checked",false);
	//             $(".user-form input[type='radio'][name='state'][value='1']").prop("checked",true);
	//         }else if(data.state===2){
	//             $(".user-form input[type='radio'][name='state']").prop("checked",false);
	//             $(".user-form input[type='radio'][name='state'][value='2']").prop("checked",true);
	//         }else{
	//             $(".user-form input[type='radio'][name='state']").prop("checked",false);
	//         }
	//     }
	// });
	getRolesByUsername(username, function(data) {
		for(var i in data) {
			$('.roles-div input[name="roleIds"][value="' + data[i].id + '"]').prop("checked", true);
		}
	});
});

//添加、更新动作
$(".user-submit").click(function() {
	if($(this).html().indexOf("添加") > 0) {
		//添加新用户
		$.ajax({
			url: "add.html",
			type: "POST",
			data: $(".user-form").serialize(),
			dataType: "json",
			success: function(data) {
				$("#user-form-div").modal("hide");
				showTips("添加成功！");
				$(".close-tip").click(function() {
					setTimeout(function() {
						window.location.reload()
					}, 220);
				})
			},
			error: function() {
				showTips("添加失败！");
			}
		});
	} else {
		//更新用户信息
		$.ajax({
			url: "update.html",
			data: $(".user-form").serialize(),
			type: "POST",
			success: function() {
				$("#user-form-div").modal("hide");
				showTips("更新成功！");
				$(".close-tip").click(function() {
					setTimeout(function() {
						window.location.reload()
					}, 220);
				})
			},
			error: function() {
				showTips("更新失败！");
			}
		});
	}
});

//重置用户密码
$(".user-list").on("click", ".reset-password", function() {
	var userTr = $(this).parents("tr");
	var username = userTr.find(".username").html();
	if(confirm('确认重置用户[' + username + ']的密码吗？')) {
		$.ajax({
			url: "resetPassword.html",
			data: {
				username: username
			},
			type: "POST",
			success: function() {
				showTips("密码已重置为：123456，请及时登录并修改密码！");
			},
			error: function() {
				showTips("重置密码失败！");
			}
		});
	}
});

//删除单个用户
$(".user-list").on("click", ".delete-this-user", function() {
	var userTr = $(this).parents("tr");
	var userId = userTr.find(".userId").html();
	var username = userTr.find(".username").html();
	if(confirm('确认删除用户[' + username + ']吗？')) {
		$.ajax({
			url: "delete.html",
			data: {
				userId: userId
			},
			type: "POST",
			success: function() {
				userTr.remove();
				showTips("删除成功！");
			},
			error: function() {
				showTips("删除失败！");
			}
		});
	}
});

//全选/取消全选出现的active阴影
var active_class = 'active';
$('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function() {
	var th_checked = this.checked; //checkbox inside "TH" table header

	$(this).closest('table').find('tbody > tr').each(function() {
		var row = this;
		if(th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
		else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
	});
});

//单行选中出现active阴影
$('#simple-table').on('click', 'td input[type=checkbox]', function() {
	var $row = $(this).closest('tr');
	if($row.is('.detail-row ')) return;
	if(this.checked) $row.addClass(active_class);
	else $row.removeClass(active_class);
});

//批量删除用户
$(".delete-selected-confirm").click(function() {
	$("#delete-confirm-dialog").modal("hide");
	var cbs = $("input[name='userIds']:checked");
	if(cbs.length === 0) {
		showTips("您未选择用户！");
	} else {
		var userIds = [];
		$.each(cbs, function(i, cb) {
			userIds[i] = cb.value;
		});

		$.ajax({
			url: "deleteMore.html",
			data: {
				userIds: userIds
			},
			type: "POST",
			traditional: true,
			success: function() {
				cbs.parent().parent().parent().remove();
				showTips("删除所选成功！");
			},
			error: function() {
				showTips("删除所选失败！");
			}
		});
	}
});