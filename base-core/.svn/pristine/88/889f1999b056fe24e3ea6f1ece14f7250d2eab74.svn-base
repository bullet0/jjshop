<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/9/16
  Time: 23:28
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<html>
<head>
    <title>展示页面</title>
</head>
<body>


${userInfo.uLastTime}
  恭喜登录成功${userInfo.uUsername}<a href="<%=request.getContextPath()%>/login/logout.action">登录出</a>
  <a href="<%=request.getContextPath()%>/login/a.action">/login/a</a><br/>
  <shiro:hasPermission name="user:insert">
    <a href="<%=request.getContextPath()%>/user/update.action">/user/update</a>
  </shiro:hasPermission>
</body>
</html>
