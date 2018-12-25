package com.bnsilu.macher;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bnsilu.util.AesEncryptUtil;
import com.bnsilu.util.RSAUtil;


public class RetryLimitHashedCredentialsMatcher extends HashedCredentialsMatcher {
	private static final Logger logger = LoggerFactory.getLogger(RetryLimitHashedCredentialsMatcher.class);

	@Autowired
	private EhCacheManager cacheManager;


	@Override
	public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
		Cache<String, AtomicInteger> passwordRetryCache = null;
		try {
			passwordRetryCache = cacheManager.getCache("passwordRetryCache");
		} catch (CacheException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String username = (String) token.getPrincipal();
		// retry count + 1
		AtomicInteger retryCount = passwordRetryCache.get(username);
		if (retryCount == null) {
			retryCount = new AtomicInteger(0);
			passwordRetryCache.put(username, retryCount);
		}
		if (retryCount.incrementAndGet() > 4) {
			
			// if retry count > 5 throw
			throw new ExcessiveAttemptsException();
		}
		Subject currentUser = SecurityUtils.getSubject();
		Session session = currentUser.getSession();
		
		Map<String,String> map = (Map<String,String>)session.getAttribute("validateCode");
		
		UsernamePasswordToken token2 = null;
		//这里可以做接受加密密码
		try {
			String desEncrypt = null;
			if(map != null) {
				String key = map.get("key");
				String iv = map.get("iv");
			    String cipherText = new String((char[])token.getCredentials());
			    
			    RSAUtil rsa = new RSAUtil();
			    String password = rsa.decipher(cipherText);
			    
			    desEncrypt = AesEncryptUtil.desEncrypt(password,key,iv);
			}
			session.removeAttribute("validateCode");
			token2 = new UsernamePasswordToken(token.getPrincipal().toString(), desEncrypt);
			
		} catch (Exception e) {
			logger.error("{} 可能正在恶意攻击用户密码\n {}","给了",e.getMessage());
			e.printStackTrace();
		}
		boolean matches = super.doCredentialsMatch(token2, info);
		if (matches) {
			// clear retry count
			passwordRetryCache.remove(username);
		}
		return matches;
	}
}