function initTab(pageNumber){
	$.ajax({
		type: 'GET',
		url: '/base-core/authority/users.action', //j3
		data:{
			curPage:pageNumber
		},
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
			var msg = result.body.list;
			$('tbody').html("");
			for(var i in msg) {

				$('tbody').append(
					'<tr>' +
					'<td class="center">' +
					'<label class="pos-rel" >' +
					'<input type="checkbox" onclick="checkOne(this)" class="ace ccc" name="userIds" value="' + msg[i].uPkId + '"/>' +
					'<span class="lbl" ></span>' +
					'<b>' + (parseFloat(i) + 1) + '</b>' +
					'</label>' +
					'</td>' +
					'<td class="username">' + msg[i].uUsername + '</td>' +
					'<td>' +
					'<a href="javascript:void(0);" class="show-role">点击查看</a>' +
					'</td>' +
					'<td class="realName">' + msg[i].uPhone + '</td>' +
					'<td class="userRole">' + msg[i].uEmail + '</td>' +
					'<td>' + getMyDate(msg[i].uCreateTime) + '</td>' +
					'<td>' + getMyDate(msg[i].uLastTime) + '</td>' +
					'<td><span class="label label-sm label-success user_state">' + msg[i].uState + '</span></td>' +
					'<td>' +
					'<a href="javascript:void(0);" class="click-revise">修改状态</a>' +
					'</td>' +
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
			});

			//初始化分页栏
			function initPagination(totalPage) {
				$('#pagination ul').html("");
				$("#pagination ul").append(
					'<li><a href="javascript:void(0);" id="one" onclick="initTab(1)">首页</a>'
				)
				for(var i = 1; i <= totalPage; i++) {
					$("#pagination ul").append(function(){
						if(i == totalPage){
							return '<li id="page' + i + '"><a href="javascript:void(0);"  onclick="initTab('+i+')">' + i + '</a>'
						}else{
							return '<li id="page' + i + '"><a href="javascript:void(0);"  onclick="initTab('+i+')">' + i + '</a>'
						}
					})
				}
				$("#pagination ul").append(
					'<li><a href="javascript:void(0);" id="two" onclick="initTab('+totalPage+')">末页</a>'
				)
				$('.msg').html('当前第' + currentPage + '页，共' + totalPage + '页，共' + totalCount + '条记录')
				$("#page1").addClass("active");
				checkA();
			}

			function checkA() {
				currentPage == 1 ? $("#one").addClass("btn btn-default disabled") : $("#one").removeClass("btn btn-default disabled");
				currentPage == totalPage ? $("#two").addClass("disabled btn btn-default") : $("#two").removeClass("disabled btn btn-default");
			}
		},
		error: function() {

		}
	});
}

$(document).ready(function() {
	initTab();

	getting(); //填充用户角色

	//设置分页栏点击时候的高亮
	$("#pagination").on("click", "li", function() {
		var aText = $(this).find('a').html();
		initTab(aText);
		if(aText == "首页") {
			$(".pagination > li").removeClass("active");
			$("#page" + (currentPage - 1)).addClass("active");
			checkA();
		} else if(aText == "末页") {
			$(".pagination > li").removeClass("active");
			$("#page" + (currentPage + 1)).addClass("active");
			checkA();
		} else {
			$(".pagination > li").removeClass("active");
			$(this).addClass("active");
		}
	})

	//点击获取数据 ,修改用户角色
	$(".user-list").on("click", ".show-update-form", function() {
		var b = $(this).parents('tr');
		var id = b.find('.ace').val();
		var ids = [];
		$.ajax({
			type: "get",
			url: "/base-core/authority/role/" + id + ".action", //j2
			async: true,
			success: function(result) {
				//状态
				if(isState(result.state)) {
					true;
				} else {
					return false;
				}
				var message = result.body;
				for(var i in message) {
					ids[i] = message[i].rPkId;
				}
				var objs = $("input[name=roleIds]");
				console.log(objs)
				$("input[name=roleIds]").each(function() {
					for(var n = 0; n < ids.length; n++) {
						if(ids[n] == $(this).val()) {
							$(this).prop("checked", true);
						}
					}
				})
			}
		});
		//点击提交
		$('.role-submit').on('click', function() {
			var roles = [];
			$('input[name=roleIds]:checked').each(function() {
				var obj = {};
				obj.rPkId = this.value;
				roles.push(obj);
			})
			var data = {};
			$.ajax({
				type: "put",
				url: "/base-core/authority/user/role/" + id + ".action", //j17
				async: true,
				dataType: 'json',
				data: JSON.stringify({
					roles
				}),
				contentType: "application/json;charset=utf-8",
				success: function(msg) {
					//状态
					if(isState(msg.state)) {
						true;
					} else {
						return false;
					}
					if(msg.state == "200") {
						showTips('用户角色修改成功');
						$("#user-form-div").modal("hide");
					} else {
						showTips('请您稍后重试');
						$("#user-form-div").modal("hide");
					}
				}
			});
		});
	});

	//模糊查询
	$(".searchbtn").click(function() {
		var text = $('#rSearch').val(); //获取文本框输入
		if(istext()) {
			$('tbody').html(""); //删除
			$.ajax({
				type: "get",
				url: "/base-core/authority/users.action", //j3
				async: true,
				data: {
					'condition': text,
					'curPage': 1
				},
				success: function(date) {
					//状态
					if(isState(date.state)) {
						true;
					} else {
						return false;
					}
					var msg = date.body.list;
					for(var i in msg) {
						$('tbody').html(
							'<tr>' +
							'<td class="center">' +
							'<label class="pos-rel" >' +
							'<input type="checkbox" class="ace"  onclick="checkOne(this)" name="userIds" value="' + msg[i].uPkId + '"/>' +
							'<span class="lbl"></span>' +
							'<b>' + (parseFloat(i) + 1) + '</b>' +
							'</label>' +
							'</td>' +
							'<td class="username">' + msg[i].uUsername + '</td>' +
							'<td>' +
							'<a href="javascript:void(0);" class="show-role">点击查看</a>' +
							'</td>' +
							'<td class="realName">' + msg[i].uPhone + '</td>' +
							'<td class="userRole">' + msg[i].uEmail + '</td>' +
							'<td>' + msg[i].uCreateTime + '</td>' +
							'<td>' + msg[i].uLastTime + '</td>' +
							'<td><span class="label label-sm label-success user_state">' + msg[i].uState + '</span></td>' +
							'<td>' +
							'<a href="javascript:void(0);" class="click-revise">修改</a>' +
							'</td>' +
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
	var objs = $("input[name=userIds]");
	for(var i = 0; i < objs.length; i++) {
		if(!objs[i].checked) {
			$("#chooseAll").prop("checked", false);
			return;
		}
	}
	$("#chooseAll").prop("checked", true)

}

//获取用户角色
function getting() {
	$.ajax({
		type: "get",
		url: "/base-core/authority/roles.action", //j1
		async: true,
		success: function(resule) {
			//状态
			if(isState(resule.state)) {
				true;
			} else {
				return false;
			}
			var myName = resule.body.list;
			for(var i in myName) {
				$('.roles-div').append(
					'<label>' +
					'<input class="ace" type="checkbox" name="roleIds" value="' + resule.body.list[i].rPkId + '">' +
					'<span class="lbl">' + myName[i].rName + '</span>' +
					'</label><br>'
				)
			}
		},
		error: function() {

		}
	});
};

//点击查看用户角色	
$(".user-list").on("click", ".show-role", function() {
	var b = $(this).parents('tr');
	var id = b.find('.ace').val();
	var txt = '';
	$.ajax({
		type: "get",
		url: "/base-core/authority/role/" + id + ".action", //j2
		async: false,
		success: function(result) {
			//状态
			if(isState(result.state)) {
				true;
			} else {
				return false;
			}
			var message = result.body;
			for(var i in message) {
				txt = txt + message[i].rName + '<br>';
			}
		},
	});
	$(this).parent('td').html(txt);
});

//点击修改用户状态
$(".user-list").on("click", ".click-revise", function() {
	var b = $(this).parents('tr');
	var id = b.find('.ace').val();
	var state = b.find('.user_state').html();
	var num;
	if(state == '正常') {
		num = 0;
	} else if(state == '禁用') {
		num = 1;
	}
	$.ajax({
		type: "put",
		url: "/base-core/authority/user/" + id + "/" + num + ".action", //j4
		async: true,
		success: function(resule) {
			//状态
			if(isState(resule.state)) {
				true;
			} else {
				return false;
			}
			var msg = resule.state;
			if(msg == '200') {
				showTips('用户状态修改成功');
				if(state == '正常') {
					b.find('.user_state').html('禁用');
					b.find('.user_state').addClass('label-warning');
				} else if(state == '禁用') {
					b.find('.user_state').html('正常');
					b.find('.user_state').removeClass('label-warning');
				}
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