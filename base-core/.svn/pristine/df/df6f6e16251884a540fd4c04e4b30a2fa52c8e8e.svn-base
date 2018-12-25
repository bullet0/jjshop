<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/9/16
  Time: 22:49
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登录页面</title>
    
    <script src="/base-core/js/components/core.js"></script>
    <script src="/base-core/js/components/md5.js"></script>
    <script src="/base-core/js/components/evpkdf.js"></script>
    <script src="/base-core/js/components/enc-base64.js"></script>
    <script src="/base-core/js/components/cipher-core.js"></script>
    <script src="/base-core/js/components/aes.js"></script>
    <script src="/base-core/js/components/hmac.js"></script>
    <script src="/base-core/js/components/sha1.js"></script>
    <script src="/base-core/js/components/sha256.js"></script>
    <script src="/base-core/js/components/pad-zeropadding-min.js"></script>
    
</head>
<body>
  宽甸登录
  <form action="<%=request.getContextPath()%>/login/login.action" method="post">
    用户名<input type="text" name="uUsername"><br>
    密码<input type="password" name="uPassword"><br>
    <input type="submit" value="登录"><a href="<%=request.getContextPath()%>/register.jsp">注册</a>
    <a href="<%=request.getContextPath()%>/reset.jsp">修改密码</a>
    ${errorMsg}
  </form>
  
  <script type="text/javascript">
  function encrypt(data) {
      var key  = CryptoJS.enc.Latin1.parse('dufy20170329java');
      var iv   = CryptoJS.enc.Latin1.parse('dufy20170329java');
      return CryptoJS.AES.encrypt(data, key, {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding}).toString();
  }

  //登录
  function login(){
      var loginName = "";
      var loginPwd ="123456";
      //可能有验证码  captchadata captchakey 等数据，这里省略，只关注重点部分
      loginName = encrypt(loginName);
      loginPwd = encrypt(loginPwd);
      console.log(loginPwd)
  }
  
  login();
  </script>
</body>
</html>
