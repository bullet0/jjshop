package com.bnsilu.filter;

import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.entity.ResponseMsg;
import com.bnsilu.service.LoginServiceImpl;
import com.google.gson.Gson;

import java.io.PrintWriter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 在使用shiro的时候,经常会有一种需求: 把登录成功后的用户对象存放到session中,方面其他地方调用。存放到session这个步骤到底应该在哪里去做,有几个地方比较合适:

 调用 Subject.login() 的时候
 使用 cas 进行单点认证的时候,集成 CasFilter 重写 onLoginSuccess() 方法
 实现 AuthenticationListener 接口,实现 onSuccess 接口

 以上三种方法,都可以做到登录成功以后把用户对象存放到session中,但是都没有考虑到一点,使用 保存登录(Remembere) 进行自动登录的情况,以上的几个方法都不会被调用,也没有找到 onRemembereLogin 类似的接口。
 解决方案

 在需要用户登录权限的地方添加一个过滤器: 判断如果用户是登录状态,并且session里的用户对象为空,则去数据库中查询用户对象放入session中。
 */
public class UserSessionFilter extends AccessControlFilter {
	private static final Logger logger = LoggerFactory.getLogger(UserSessionFilter.class);
	@Autowired
	private LoginServiceImpl loginServiceImpl;
    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        Subject subject = getSubject(request, response);
        if (subject == null) {
        	logger.info("{} 没有登陆信息,重新登陆",request.getRemoteAddr());
            // 没有登录
            return false;
        }
        HttpSession session = WebUtils.toHttp(request).getSession();
        Object sessionUsername = session.getAttribute("userInfo");
        if (sessionUsername == null) {
        	BnUsersVO user = loginServiceImpl.queryUserInfo(subject.getPrincipal().toString());
            session.setAttribute("userInfo",user);
        }
        logger.info("{} {} 已验证登陆，放行",request.getRemoteAddr(),subject.getPrincipal().toString());
        
        HttpServletRequest req = (HttpServletRequest)request;
        String requestURI = req.getRequestURI();
       
        
		 if(requestURI.equals("/base-core/")) {
			 String header = ((HttpServletRequest) request).getHeader("X-Requested-With");
			 if("XMLHttpRequest".equalsIgnoreCase(header)){
				PrintWriter out = response.getWriter();
	         	response.setContentType("application/json;charset=utf-8");
	         	ResponseMsg msg = new ResponseMsg();
	         	msg.setState(302);
	         	msg.setMsg("登陆成功");
	         	String json = new Gson().toJson(msg);
	         	out.println(json);
	         	out.flush();
	         	out.close();
	         	return false;
    		 }else {
    			((HttpServletResponse)response).sendRedirect(req.getContextPath()+"/pages/index.html");;
 	         	return false;	
    	     }
    		 
         	
         
		 }	

        return true;
    }

    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        return true;
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        return true;
    }
}