package com.bnsilu.realm;

import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.UserPermissionVo;
import com.bnsilu.macher.RetryLimitHashedCredentialsMatcher;
import com.bnsilu.service.LoginServiceImpl;

/**
 * Created by Administrator on 2017/9/16.
 */
public class UserAuthenticationRealm extends AuthorizingRealm {
	private static final Logger logger = LoggerFactory.getLogger(UserAuthenticationRealm.class);

	@Autowired
	private LoginServiceImpl loginService;
	
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    	logger.debug("正在查询权限");
    	Object principal = principalCollection.getPrimaryPrincipal();
        List<UserPermissionVo> userPermissionVo = loginService.queryPermission(principal.toString());
        
        List<String> promissions = new ArrayList<String>();
        if(userPermissionVo != null) {
        	for (UserPermissionVo uPermissionVo : userPermissionVo) {
            	if(uPermissionVo != null) {
            		promissions.add(uPermissionVo.getpUrl());
            	}
    		}
        }
        

        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.addStringPermissions(promissions);
        logger.debug("查询 {} 权限：{}",principal.toString(),promissions);
        return info;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    	
    	String username = authenticationToken.getPrincipal().toString();
    	logger.info("{}正在验证登录用户名",username);
        if(username != null) {
    		BnUsers user = loginService.queryUsername(username);
        	if(user != null) {
        		Integer uState = user.getuState();
        		if(uState != 1) {
        			logger.info("{} 用户名被锁定",username);
        			throw new DisabledAccountException();
        		}else {
        			BnUsers user2 = loginService.queryPassword(user.getuUsername());
        			
            		SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(username,user2.getuPassword(), ByteSource.Util.bytes(user2.getuSalt()),"UserAuthenticationRealm");
            		logger.info("{} 用户名验证成功",username);
                	return info;
        		}
        	}
        }
       
        logger.info("{} 用户名不存在验证失败",username);
        return null;
        
    }

    public void clearCached() {
        PrincipalCollection principals = SecurityUtils.getSubject().getPrincipals();
        logger.info("{} 用户登出，清空session作用域",principals.toString());
        super.clearCache(principals);
    }

    public static void main(String[] args){
        Md5Hash md5Hash = new Md5Hash("a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3","1234",5);
        System.out.println(md5Hash);
    }
}
