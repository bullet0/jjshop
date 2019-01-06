<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<form action="<%=request.getContextPath()%>/login/resetPwd.action" method="post">
	    用户名<input type="text" name="uUsername"><br>
	    密码<input type="password" name="uPassword"><br>
	    <input type="submit" value="修改密码">
  	</form>
</body>
</html>