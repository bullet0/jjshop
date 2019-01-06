$(document).ready(function() {
	$.ajax({
		type: 'get',
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
			var msg = result.body;
			$('tbody').append(
				'<tr>' +
				'<td class="username">' + msg.uUsername + '</td>' +
				'<td class="realName">' + msg.uPhone + '</td>' +
				'<td class="userRole">' + msg.uEmail + '</td>' +
				'<td>' + getMyDate(msg.uCreateTime) + '</td>' +
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
	var n = JSON.parse(sessionStorage.getItem('key')).id;
	console.log(n)
	$('.role-submit').on('click', function() {
		if($('#form-add-username').val() == '') {
			showTips('用户名不能为空');
			return false;
		} else {
			true;
		};
		//isEcho()
		if($('#form-add-email').val() == '') {
			showTips('邮箱不能为空');
			return false;
		} else {
			if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($('#form-add-email').val())){
				showTips("请输入正确的邮箱格式");
				return false;
			}else{
				true;
			}
		};
		if($('#form-add-tel').val() == '') {
			showTips('手机号码不能为空');
			return false;
		} else {
			if(!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test($('#form-add-tel').val())){
				showTips("请输入正确的手机格式");
				return false;
			}else{
				true;
			}
		};
		$.ajax({
			type:"put",
			url:"/base-core/authority/user/" + n + ".action", //j6
			dataType: "json",
			async:true,			
			data: JSON.stringify({
				'uUsername' : $('#form-add-username').val(),
				'uPhone' : $('#form-add-tel').val(),
				'uEmail' : $('#form-add-email').val()
			}),
			contentType:"application/json",
			success: function(msg){
				//状态
				if(isState(msg.state)) {
					true;
				} else {
					return false;
				}
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
//检测为特殊字符
function isSpecial(obj) {
	if(!/^([\u4e00-\u9fa5A-Za-z0-9,.?!;，。？！、；])*$/.test(obj)) {
		showTips("不能输入特殊字符");
		return false;
	} else {
		return true;
	}
}
//日期转化
function getMyDate(str) {
	var oDate = new Date(str),
		oYear = oDate.getFullYear(),
		oMonth = oDate.getMonth() + 1,
		oDay = oDate.getDate(),
		oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay); //最后拼接时间  
	return oTime;
};

function getzf(num) {
	if(parseInt(num) < 10) {
		num = '0' + num;
	}
	return num;
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
//用户名是否重复
function isEcho() {
	$.ajax({
		type: "get",
		url: "/base-core/login/checkNameRepite.action",
		async: true,
		success: function(v) {
			var num = v.state;
			console.log(num);
			if(num == 200) {
				showTips("用户名可用");
			} else {
				showTips("用户名已经存在");
			}
		}
	});
}