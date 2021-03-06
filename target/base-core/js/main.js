function encrypt(data, key, iv) {
	key = CryptoJS.enc.Latin1.parse(key);
	iv = CryptoJS.enc.Latin1.parse(iv);
	return CryptoJS.AES.encrypt(data, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	}).toString();
};
//后台登录验证--非空
function indexName() {
	var username1 = $('#username1').val();
	if(username1 == '') {
		$('#username1').next().html('请输入您的用户名');
	} else {
		$('#username1').next().html('');
		return true;
	};
}

function indexWord() {
	var username1 = $('#password1').val();
	if(username1 == '') {
		$('#password1').next().html('请输入您的密码');
	} else {
		$('#password1').next().html('');
		return true;
	};
}

function allIndex() {

	if(indexName() && indexWord()) {
		$.ajax({
			type: "GET",
			dataType: "json",
			async: false,
			url: "/base-core/login/a48Af.action",
			success: function(result) {
				var mima = $('#password1').val();
				var sHA256 = CryptoJS.SHA256(mima).toString(CryptoJS.enc.Hex);
				var pwd = encrypt(sHA256, result.body.key, result.body.iv);
				var key1 = encrypt(result.body.iv, result.body.key, result.body.iv);
				var iv1 = encrypt(result.body.key, result.body.key, result.body.iv);
				
				var publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCulsf0wuAkiHycI3VgJp5Hra8eW8QN3uTiGLoR"
								+"IASxu5BLz8psBIoMcUlslx48kqwZThsDmhB3nmCoOzocwzmKY+b3n2rOzsnzk9tHcbb4AFH3xSmZ"
								+"wm2CPK1vkk+G+8+xE/kmfyvdqoY1gZmad1HUYXSv57QLwn2SeT3zPTjycwIDAQAB";		
				var enc = new JSEncrypt();
				enc.setPublicKey(publicKey);
				pwd = enc.encrypt1(pwd);
				
				$.ajax({
					type: "POST",
					url: "/base-core/login/login.action",
					data: {
						"uUsername": $('#username1').val(),
						"uPassword": pwd,
						"key": key1,
						"iv": iv1
					},
					success: function(result) {
						if(result.state == 500 || result.state == 403) {
							$('#msg').html(result.msg);
						} else if(result.state == 200 || result.state == 302) {
							window.location.href = "/base-core/pages/blankMain.html";
						} else {
							$('#msg').html("您的网络不通畅，请稍后重试");
						}
					},
					error: function(msg) {
						if(msg.status == "404"){
							//后期调整404页面路径
							window.location="/base-core/404.html"
						}else{
							$('#msg').html("您的网络不通畅，请稍后重试");
						}
					}
				});
			},
			error: function(msg) {
				if(msg.status == "404"){
					window.location="/base-core/404.html"
				}else{
					$('#msg').html("您的网络不通畅，请稍后重试");
				}
			}
		});
		return false;
	} else {
		return false;
	};
	return false;
}
//前台登录验证--非空
function regName() {
	var username1 = $('#userName').val();
	if(username1 == '') {
		$('#userName').next().html('请输入您的用户名');
	} else {
		$('#userName').next().html();
		$('#userName').addClass('valid');
		return true;
	};
}

function regWord() {
	var username1 = $('#passWord').val();
	if(username1 == '') {
		$('#passWord').next().html('请输入您的用户名');
	} else {
		$('#passWord').next().html();
		$('#passWord').addClass('valid');
		return true;
	};
}

function allReg() {
	if(regName() && regWord()) {
		$.ajax({
			type: "GET",
			dataType: "json",
			async: false,
			url: "/base-core/login/a48Af.action",
			success: function(result) {
				var mima = $('#passWord').val();
				var pwd = encrypt(mima, result.body.key, result.body.iv);
				var key1 = encrypt(result.body.iv, result.body.key, result.body.iv);
				var iv1 = encrypt(result.body.key, result.body.key, result.body.iv);

				$.ajax({
					type: "POST",
					url: "/base-core/login/login.action",
					data: {
						"uUsername": $('#userName').val(),
						"uPassword": pwd,
						"key": key1,
						"iv": iv1
					},
					success: function(result) {
						if(result.state == 500 || result.state == 403) {
							$('#msg').html(result.msg);
						} else if(result.state == 200 || result.state == 302) {
							window.location.href = "/base-core/pages/Bindex.html";
						} else {
							$('#msg').html("您的网络不通畅，请稍后重试");
						}
					},
					error: function() {
						$('#msg').html("您的网络不通畅，请稍后重试");
					}
				});
			},
			error: function() {
				$('#msg').html("您的网络不通畅，请稍后重试");
			}
		});
	} else {
		return false;
	};
	return false;
}
//
function checkName() {
	var username = $('#uName').val();
	var reg = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
	if(username == '') {
		$('#uName').next().html('请输入您的用户名');
	} else {
		if(!reg.test(username)) {
			$('#uName').next().html('用户名必须是4-20位数字或字母组成，开头不能是数字');
			return false;
		} else {
			$.ajax({
				type: 'GET',
				url: '/base-core/login/uUsername.action',
				dataType: 'json',
				success: function(result) {
					var msg = result.state;
					console.log(msg);
					if(msg == 500) {
						$('#uName').next().html('该用户名已存在');
					} else if(msg == 200) {
						$('#uName').addClass('valid');
					} else {
						$('#uName').next().html('网络异常，稍后重试');
					}
				},
				error: function() {
					$('#msg').html('网络异常，稍后重试');
				}
			});
			return true;
		};
	};
}

function checkPwd() {
	var password = $('#pWord').val();
	var reg = /^[a-zA-Z]\w{5,17}$/; 
	if(password == '') {
		$('#pWord').next().html('请输入您的密码');
	} else {
		if(!reg.test(password)) {
			$('#pWord').next().html('以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
			return false;
		} else {
			$('#pWord').next().html('');
			$('#pWord').addClass('valid')
			return true;
		};
	};
}

function checkPwd1() {
	var password = $('#pWord').val();
	var password1 = $('#pWord1').val();
	if(password1 == '') {
		$('#pWord1').next().html('请输入您的确认密码');
	} else {
		if(password !== password1) {
			$('#pWord1').next().html('您两次密码输入不一致！');
			return false;
		} else {
			$('#pWord1').next().html('');
			$('#pWord1').addClass('valid')
			return true;
		};
	}
}

function checkAll() {
	if(checkName() && checkPwd() && checkPwd1()) {
		$.ajax({
			type: "GET",
			dataType: "json",
			async: false,
			url: "/base-core/login/a48Af.action", //url
			success: function(result) {
				var mima = $('#pWord').val();
				var pwd = encrypt(mima, result.body.key, result.body.iv);
				var key1 = encrypt(result.body.iv, result.body.key, result.body.iv);
				var iv1 = encrypt(result.body.key, result.body.key, result.body.iv);

				$.ajax({
					type: "POST",
					url: "/base-core/login/login.action",
					data: {
						"uUsername": $('#uName').val(),
						"uPassword": pwd,
						"key": key1,
						"iv": iv1
					},
					success: function(result) {
						if(result.state == 500 || result.state == 403) {
							$('#msg').html(result.msg);
						} else if(result.state == 200 || result.state == 302) {
							window.location.href = "/base-core/pages/Bindex.html";
						} else {
							$('#msg').html("您的网络不通畅，请稍后重试");
						}
					},
					error: function() {
						$('#msg').html("您的网络不通畅，请稍后重试");
					}
				});
			},
			error: function() {
				$('#msg').html("您的网络不通畅，请稍后重试");
			}
		});
	} else {
		return false;
	}
	return false;
}

//修改密码
function checkNamec() {
	var username = $('#cName').val();
	var reg = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
	if(username == '') {
		$('#cName').next().html('请输入您的用户名');
	} else {
		if(!reg.test(username)) {
			$('#cName').removeClass('valid')
			$('#cName').next().html('用户名必须是4-20位数字或字母组成，开头不能是数字');
			return false;
		} else {
			$.ajax({
				type: 'GET',
				url: '/base-core/login/checkNameRepite.action',
				dataType: 'json',
				data:{uUsername: username},
				success: function(result) {
					var msg = result.state;
					if(msg == 500) {
						$('#cName').addClass('valid');
						$('#cName').next().html('');
					} else if(msg == 200) {
						$('#cName').next().html("用户名不存在");
						$('#cName').removeClass('valid')
					} else {
						$('#cName').next().html('网络异常，稍后重试');
					}
				},
				error: function() {
					$('#msg').html("网络异常，稍后重试");
				}
			});
			return false;
		};
	};
}

function checkPwdc() {
	var password = $('#cPwd').val();
	var reg = /^[a-zA-Z]\w{5,17}$/;
	if(password == ''){
		$('#cPwd').next().html('请输入您的密码');
	} else {
		if(!reg.test(password)) {
			$('#cPwd').next().html('以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
			$('#cPwd').removeClass('valid')
			return false;
		} else {
			$('#cPwd').next().html('');
			$('#cPwd').addClass('valid')
			return true;
		};
	};
}

function checkPwdc1() {
	var password = $('#cPwd').val();
	var password1 = $('#cPwd1').val();
	if(password1 == '') {
		$('#cPwd1').removeClass('valid')
		$('#cPwd1').next().html('请您再次输入密码');
	} else {
		if(password !== password1) {
			$('#cPwd1').removeClass('valid')
			$('#cPwd1').next().html('您两次密码输入不一致！');
			return false;
		} else {
			$('#cPwd1').next().html('');
			$('#cPwd1').addClass('valid')
			return true;
		};
	}
}



function checkAllc() {
	if($('#cName').hasClass('valid') && checkPwdc() && checkPwdc1()) {
		$.ajax({
			type: "GET",
			dataType: "json",
			async: false,
			url: "/base-core/login/a48Af.action", //url
			success: function(result) {
				var mima = $('#cPwd').val();

				var sHA256 = CryptoJS.SHA256(mima).toString(CryptoJS.enc.Hex);
				var pwd = encrypt(sHA256, result.body.key, result.body.iv);
				var key1 = encrypt(result.body.iv, result.body.key, result.body.iv);
				var iv1 = encrypt(result.body.key, result.body.key, result.body.iv);

				var publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCulsf0wuAkiHycI3VgJp5Hra8eW8QN3uTiGLoR"
					+"IASxu5BLz8psBIoMcUlslx48kqwZThsDmhB3nmCoOzocwzmKY+b3n2rOzsnzk9tHcbb4AFH3xSmZ"
					+"wm2CPK1vkk+G+8+xE/kmfyvdqoY1gZmad1HUYXSv57QLwn2SeT3zPTjycwIDAQAB";
				var enc = new JSEncrypt();
				enc.setPublicKey(publicKey);
				pwd = enc.encrypt1(pwd);

				$.ajax({
					type: "POST",
					url: "/base-core/login/resetPwd.action",
					data: {
						"uUsername": $('#cName').val(),
						"uPassword": pwd,
						"key": key1,
						"iv": iv1
					},
					success: function(result) {
						if(result.state == 500) {
							$('#div').html(result.msg);
						} else if(result.state == 200) {
							$('#div').html("密码修改成功，页面跳转登录页面");
							window.location.href = "/base-core/pages/index.html";
						} else {
							$('#div').html("您的网络不通畅，请稍后重试");
						}
					},
					error: function(msg) {
						
						$('#div').html("您的网络不通畅，请稍后重试");
						
					}
				});
			},
			error: function(msg) {
				
				$('#div').html("您的网络不通畅，请稍后重试");
				
			}
		});
	} 
	return false;
	
}