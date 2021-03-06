package com.bnsilu.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.ResponseMsg;
import com.bnsilu.exception.RegexException;
import com.bnsilu.service.LoginServiceImpl;
import com.bnsilu.util.AesEncryptUtil;
import com.bnsilu.util.RSAUtil;
import com.sun.xml.internal.messaging.saaj.util.Base64;

import sun.misc.BASE64Decoder;

/**
 * Created by Administrator on 2017/9/16.
 */
@Controller
@RequestMapping("/login")
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private LoginServiceImpl loginService;
	
    //shiro的登录方法，访问这里，但这里只编写登录失败逻辑，登录成功逻辑shiro来完成
    @RequestMapping(value="/login",method= {RequestMethod.GET,RequestMethod.POST})
    @ResponseBody
    public ResponseMsg login(HttpServletRequest req,HttpServletResponse resp) throws Exception{
    	StringBuffer requestURL = req.getRequestURL();
    	System.out.println(requestURL);
        //当执行登录认证时，会先过authc的过滤器，shiro会自己拿出用户名和密码进行比对，如果成功则放行，
        //如果登录失败，则会在request左右域中放置一个错误消息，我们取出错误消息，进行跳转错误页面即可
        String exceptionClassName = (String)req.getAttribute("shiroLoginFailure");
        ResponseMsg msg = new ResponseMsg();
        if(exceptionClassName!=null){
        	logger.info("{}请求验证登录失败",new Object[] {req.getRemoteAddr()});
        	if (UnknownAccountException.class.getName().equals(exceptionClassName)) {
            	logger.debug("{} 请求账号不存在",new Object[] {req.getRemoteAddr()});
            	msg.setState(500);
            	msg.setMsg("账号或密码错误，请重新输入");
            } else if (IncorrectCredentialsException.class.getName().equals(
                    exceptionClassName)) {
            	logger.debug("{} 请求用户名/密码错误",new Object[] {req.getRemoteAddr()});
            	msg.setState(500);
            	msg.setMsg("账号或密码错误，请重新输入");
            }else if (ExcessiveAttemptsException.class.getName().equals(
                    exceptionClassName)) {
            	logger.debug("{} 请求账号被锁定，请修改密码",new Object[] {req.getRemoteAddr()});
            	msg.setState(500);
            	msg.setMsg("您尝试次数超过5次，账号已被锁定，请修改密码");
            }else if (DisabledAccountException.class.getName().equals(
                    exceptionClassName)) {
            	logger.debug("{} 请求账号被禁用",new Object[] {req.getRemoteAddr()});
            	msg.setState(500);
            	msg.setMsg("账号被禁用，请联系管理员");
            }else{
            	logger.warn("用户触发了未知错误");
                msg.setState(500);
            	msg.setMsg("当前网络不稳定，请稍后重试");
            }
            return msg;
        }else {
        	Object attribute = req.getSession().getAttribute("userInfo");
        	if(attribute == null) {
        		logger.info("{}还未登录，重新登陆",new Object[] {req.getRemoteAddr()});
        		boolean flag = isAjax(req);
        		if(flag) {
        			//登出了
            		msg.setState(401);
                	msg.setMsg("您还未登录，请登录");
            		return msg;
        		}else {
        			resp.sendRedirect(req.getContextPath()+"/pages/index.html");
        			return null;
        		}
        	}else {
        		//如果exceptionClassName为空，则是重复登录，跳转到主页面即可
        		String uUsername = req.getParameter("uUsername");
        		String uPassword = req.getParameter("uPassword");
        		if(uPassword == null || uUsername == null || uPassword.isEmpty() || uUsername.isEmpty()){
        			throw new NullPointerException("用户登陆时，没有填写用户名或密码");
        		}
        		
        		String pattern1 = "^[a-zA-Z][a-zA-Z0-9]{3,19}$";
                if(!Pattern.matches(pattern1, uUsername)) {
                	throw new RegexException("用户登陆时填写用户名不符合规范");
                }
              
        		
        		BnUsers userInfo = loginService.queryUsername(uUsername);
        		if(userInfo == null){
        			msg.setState(500);
                	msg.setMsg("账号或密码错误，请重新输入");
        		}else if(userInfo.getuState() == 0) {
        			logger.debug("{} 请求账号被锁定，请修改密码",new Object[] {req.getRemoteAddr()});
                	msg.setState(500);
                	msg.setMsg("账号被锁定，请修改密码");
        		}else {
        			BnUsers user = loginService.queryPassword(uUsername);
        			String EncryptPwd1 = user.getuPassword();
        			String salt = user.getuSalt();
        			//解密
        			RSAUtil rsa = new RSAUtil();
        			uPassword = rsa.decipher(uPassword);
    			    
            		String desPwd = AesEncryptUtil.desPwd(uPassword);
            		
            		
        			Md5Hash EncryptPwd2 = new Md5Hash(desPwd,salt,5);
        			if(EncryptPwd1.equals(EncryptPwd2.toString())) {
        				logger.info("{} 身份已验证，放行",new Object[] {req.getRemoteAddr()});
        				msg.setState(302);
                		msg.setMsg("请重定向到首页");
        			}else {
        				logger.debug("{} 请求用户名/密码错误",new Object[] {req.getRemoteAddr()});
                    	msg.setState(500);
                    	msg.setMsg("账号或密码错误，请重新输入");
        			}
        		}
        		
            	return msg;
        	}
        	
        }
        
    }
    @RequestMapping(value="/success",method= {RequestMethod.GET})
    @ResponseBody
    public ResponseMsg success(HttpServletRequest req) {

    	ResponseMsg msg = new ResponseMsg();
    	msg.setMsg("登录成功");
    	msg.setState(200);
    	return msg;
    }
    
    public boolean isAjax(ServletRequest request){
        String header = ((HttpServletRequest) request).getHeader("X-Requested-With");
        if("XMLHttpRequest".equalsIgnoreCase(header)){
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }
    
    @RequestMapping(value="/register",method= {RequestMethod.POST})
    @ResponseBody
    public ResponseMsg register(HttpServletRequest req,BnUsers user) throws Exception{
    	if(user.getuUsername() == null 
    			|| user.getuPassword()==null 
    			||user.getuUsername().isEmpty() 
    			|| user.getuPassword().isEmpty()   ) {
    		throw new NullPointerException("用户注册未填写用户名密码");
    	}
    	
    	String pattern1 = "^[a-zA-Z][a-zA-Z0-9]{3,19}$";
        if(!Pattern.matches(pattern1, user.getuUsername())) {
        	throw new RegexException("用户注册时填写用户名不符合规范");
        }
       
    	logger.info("{}请求注册，注册名称为{}",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    	
    	RSAUtil rsa = new RSAUtil();
		String uPassword = rsa.decipher(user.getuPassword());
    	String desPwd = AesEncryptUtil.desPwd(uPassword);
		user.setuPassword(desPwd);
		
    	//&useAffectedRows=true
    	int useAffectedRows = loginService.insertUser(user);
    	if(useAffectedRows != 0) {
    		logger.info("{}请求注册，注册名称为{},注册成功",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    		ResponseMsg msg = new ResponseMsg();
    		msg.setState(200);
    		msg.setMsg("注册成功");
    		return msg;
    	}else {
    		logger.info("{}请求注册，注册名称为{},注册失败",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    		ResponseMsg msg = new ResponseMsg();
    		msg.setState(500);
    		msg.setMsg("注册失败");
    		return msg;
    	}
    	
    }
    @RequestMapping(value="/resetPwd",method= {RequestMethod.POST})
    @ResponseBody
    public ResponseMsg resetPwd(HttpServletRequest req,BnUsers user) throws Exception{
    	if(user.getuUsername() == null 
    			|| user.getuPassword()==null 
    			||user.getuUsername().isEmpty() 
    			|| user.getuPassword().isEmpty()   ) {
    		throw new NullPointerException("用户修改密码时未填写用户名密码");
    	}
    	
    	
    	logger.info("{} {} 请求修改密码",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    	
    	RSAUtil rsa = new RSAUtil();
		String uPassword = rsa.decipher(user.getuPassword());
    	String desPwd = AesEncryptUtil.desPwd(uPassword);
    	user.setuPassword(desPwd);
    	
    	//&useAffectedRows=true
    	int useAffectedRows = loginService.updatePassword(user);
    	
    	if(useAffectedRows == -1000) {
    		logger.info("{} 请求修改密码，但是没有{}用户",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    		ResponseMsg msg = new ResponseMsg();
    		msg.setState(500);
    		msg.setMsg("修改密码失败");
    		return msg;
    	}
    	if(useAffectedRows != 0) {
    		logger.info("{} {} 请求修改密码，修改成功",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    		ResponseMsg msg = new ResponseMsg();
    		msg.setState(200);
    		msg.setMsg("修改密码成功");
    		return msg;
    	}else {
    		logger.info("{} {} 请求修改密码，修改失败",new Object[] {req.getRemoteAddr(),user.getuUsername()});
    		ResponseMsg msg = new ResponseMsg();
    		msg.setState(500);
    		msg.setMsg("修改密码失败");
    		return msg;
    	}
    	
    }
    
    @RequestMapping(value="/a48Af",method= {RequestMethod.GET})
    @ResponseBody
    public ResponseMsg getValidateCode(HttpServletRequest req,HttpServletResponse resp) {
    	logger.info("{} 正在获取加密随机码",req.getRemoteAddr());
    	ResponseMsg msg = new ResponseMsg();
    	msg.setState(200);
    	msg.setMsg("获取数据成功");
    	HttpSession session = req.getSession();
    	
    	String key = UUID.randomUUID().toString();
    	String iv = UUID.randomUUID().toString();
    	Map<String, String> map = new HashMap<>();
    	map.put("key", key.substring(0, 16));
    	map.put("iv", iv.substring(0, 16));
    	logger.debug("加密随机码 = {}",map);
    	session.setAttribute("validateCode",map);
    	
    	msg.setBody(map);
    	logger.info("{} 正在返回加密随机码",req.getRemoteAddr());
    	return msg; 
    } 
    @RequestMapping(value="/checkNameRepite",method= {RequestMethod.GET})
    @ResponseBody
    public ResponseMsg checkNameRepite(String uUsername) throws RegexException {
    	if(uUsername == null 
    			|| uUsername.isEmpty()   ) {
    		throw new NullPointerException("用户注册时未填写用户名");
    	}
        String pattern = "^[a-zA-Z][a-zA-Z0-9]{3,19}$";
       
        if(!Pattern.matches(pattern, uUsername)) {
        	throw new RegexException("用户注册时填写用户名不符合规范");
        }
    	
    	
    	BnUsers user = loginService.queryUsername(uUsername);
    	
    	ResponseMsg msg = new ResponseMsg();
    	if(user == null) {
    		msg.setState(200);
        	msg.setMsg("用户名可以使用");
    	}else {
    		msg.setState(500);
        	msg.setMsg("用户名不可以使用");
    	}
    	
    	return msg;
    }
    
}
