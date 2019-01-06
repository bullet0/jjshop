package com.bnsilu.filter;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.entity.ResponseMsg;
import com.bnsilu.service.LoginServiceImpl;
import com.google.gson.Gson;

public class UserFormAuthenticationFilter extends FormAuthenticationFilter {
	private static final Logger logger = LoggerFactory.getLogger(UserFormAuthenticationFilter.class);
	@Autowired
	private LoginServiceImpl loginServiceImpl;
	//登录成功后会触发这个方法
	@Override
	protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request,
			ServletResponse response) throws Exception {

		//将用户信息设置到session中
		String username = subject.getPrincipal().toString();
		logger.info("{} {}验证登录成功",request.getRemoteAddr(),username);
		
		BnUsersVO user = loginServiceImpl.queryUserInfo(username);
		HttpServletRequest req = (HttpServletRequest)request;
		HttpSession session = req.getSession();
		session.setAttribute("userInfo", user);
		logger.info("{} {}数据放入session",request.getRemoteAddr(),username);
		//设置用户当前登录时间，用来作为上次登录时间展示
		
		loginServiceImpl.updateLastTime(user.getuPkId());
		logger.info("{} {} 记录本次登录时间",request.getRemoteAddr(),username);
		
		//登录成功
		HttpServletResponse resp = (HttpServletResponse)response;
		PrintWriter out = resp.getWriter();
		resp.setContentType("application/json;charset=utf-8");
		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("登录成功");
		Gson gson = new Gson();
		out.println(gson.toJson(msg));
		out.flush();
		out.close();
		//this.setSuccessUrl("");
		//return super.onLoginSuccess(token, subject, request, response);
		return false;
	}
	
	
	
	
	
}
