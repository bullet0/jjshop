package com.bnsilu.exceptionresolver;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import com.bnsilu.entity.ResponseMsg;
import com.bnsilu.exception.RegexException;
import com.google.gson.Gson;

public class GlobalExceptionResolver implements HandlerExceptionResolver {

	// 异常对象

	private Logger logger = LoggerFactory.getLogger(GlobalExceptionResolver.class);

	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) {

		// 判断是否是本地异常
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		response.setContentType("application/json;charset=utf-8");
		ResponseMsg msg = new ResponseMsg();
		msg.setState(500);
		Gson gson = new Gson();
		if (ex instanceof NullPointerException) {
			logger.warn("后台空指针异常 {}",ex.getMessage());
			msg.setMsg("必填参数未填写");
			String json = gson.toJson(msg);
			out.println(json);
			
		}else if (ex instanceof RegexException) {
			logger.warn("用户传来的数据格式不正确 {}",ex.getMessage());
			msg.setMsg("用户传来的数据格式不正确");
			String json = gson.toJson(msg);
			out.println(json);
		}else {
			logger.warn("未知异常 {}",ex.getMessage());
			msg.setMsg("未知错误，请联系管理员");
			String json = gson.toJson(msg);
			out.println(json);
		}

		out.flush();
		out.close();
		return null;
	}

}
