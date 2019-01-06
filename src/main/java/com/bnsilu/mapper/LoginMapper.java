package com.bnsilu.mapper;

import java.util.List;

import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.entity.UserPermissionVo;

public interface LoginMapper {

	BnUsers queryUsername(String username);

	BnUsersVO queryUserInfo(String username);
	BnUsers queryPassword(String username);

	int insertUser(BnUsers user);

	void updateLastTime(Integer uPkId);

	int updatePassword(BnUsers user);

	List<UserPermissionVo> queryPermission(String uUsername);

}
