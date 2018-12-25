package com.bnsilu.service;

import java.util.List;
import java.util.UUID;

import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.entity.UserPermissionVo;
import com.bnsilu.mapper.LoginMapper;
import com.bnsilu.realm.UserAuthenticationRealm;

@Service
public class LoginServiceImpl {
	private static final Logger logger = LoggerFactory.getLogger(LoginServiceImpl.class);

	@Autowired
	private LoginMapper loginMapper;
	@Autowired
	private EhCacheManager cacheManager;
	public BnUsers queryUsername(String uUsername) {
		logger.info("查询 用户名  {}",uUsername);
		BnUsers user = loginMapper.queryUsername(uUsername);
		return user;
	}

	public BnUsers queryPassword(String uUsername) {
		logger.info("查询  {} 密码",uUsername);
		
		return loginMapper.queryPassword(uUsername);
	}
	public BnUsersVO queryUserInfo(String uUsername) {
		logger.info("查询  {} 信息",uUsername);
		return loginMapper.queryUserInfo(uUsername);
	}

	public int insertUser(BnUsers user) {
		logger.info("增加用户 {} ",user);
		
		user.setuSalt(UUID.randomUUID().toString());
		
        Md5Hash md5Hash = new Md5Hash(user.getuPassword(),user.getuSalt(),5);
		user.setuPassword(md5Hash.toString());
		return loginMapper.insertUser(user);
	}

	public void updateLastTime(Integer uPkId) {
		logger.info("记录用户当前登录时间 ");
		loginMapper.updateLastTime(uPkId);
	}

	public int updatePassword(BnUsers user) {
		logger.info("修改用户 {} 密码 ",user.getuUsername());
		BnUsers user2 = loginMapper.queryPassword(user.getuUsername());
		if(user2 == null) {
			return -1000;
		}
		Md5Hash md5Hash = new Md5Hash(user.getuPassword(),user2.getuSalt(),5);
		user.setuPassword(md5Hash.toString());
		int useAffectedRows = loginMapper.updatePassword(user);
		if(useAffectedRows != 0) {
			Cache<Object, Object> passwordRetryCache = cacheManager.getCache("passwordRetryCache");
			passwordRetryCache.remove(user.getuUsername());
		}
		
		return useAffectedRows;
	}

	public List<UserPermissionVo> queryPermission(String uUsername) {
		logger.info("查询  {} 权限",uUsername);
		return loginMapper.queryPermission(uUsername);
	}
	
}
