package com.bnsilu.mapper;

import java.util.List;

import com.bnsilu.entity.BnPermission;
import com.bnsilu.entity.BnRole;
import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.util.PageUtil;

public interface AuthorityMapper {
 
	List<BnRole> queryRolesByPage(PageUtil page);

	List<BnRole> queryRolesByUPkId(Integer uPkId);

	List<BnPermission> queryPermissions();

	List<BnPermission> queryPermissionsByUPkId(Integer uPkId);


	void insertRoleByUPkId(BnUsers user);

	void deleteRoleByUPkId(BnUsers user);

	void deletePermissionByRPkId(BnRole role);

	void insertPermissionByRPkId(BnRole role);

	Integer insertPermission(BnPermission permission);

	Integer insertRole(BnRole role);

	Integer updateRoleByRPkId(BnRole role);

	Integer updatePermissionByPPkId(BnPermission permission);

	List<BnUsersVO> queryUsersByPage(PageUtil page);

	Integer updateUserState(BnUsers user);

	Integer updateUserInfo(BnUsers user);

	List<BnPermission> queryPermissionsByRPkId(Integer rId);

	Integer deleteRole(Integer rPkId);

	Integer deletePermissionByPPkId(Integer pPkId);

	void deletePermissions(List<BnPermission> permissions);

	void deleteRoles(List<BnRole> roles);

	List<BnPermission> permissionsByPage(PageUtil page);

	
}
