package com.bnsilu.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bnsilu.entity.BnPermission;
import com.bnsilu.entity.BnRole;
import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.mapper.AuthorityMapper;
import com.bnsilu.util.PageUtil;

@Service
public class AuthorityService {
	@Autowired
	private AuthorityMapper authorityMapper ;
	
	//查询全部角色
	public List<BnRole> queryRolesByPage(PageUtil page) {
		return authorityMapper.queryRolesByPage(page);
	}
	//根据用户id查询角色
	public List<BnRole> queryRolesByUPkId(Integer uPkId) {
		return authorityMapper.queryRolesByUPkId(uPkId);
	}
	//查询全部权限
	public List<BnPermission> queryPermissions() {
		return authorityMapper.queryPermissions();
	}
	//根据用户id查询权限
	public List<BnPermission> queryPermissionsByUPkId(Integer uPkId) {
		List<BnPermission> permissions = authorityMapper.queryPermissionsByUPkId(uPkId);
		List<BnPermission> permissions2 = new ArrayList<>();
		for (BnPermission bnPermission : permissions) {
			if(permissions2.isEmpty()) {
				permissions2.add(bnPermission);
				continue;
			}
			for (BnPermission bnPermission2 : permissions2) {
				if(bnPermission2.getpPkId() == bnPermission.getpPkId()) {
					continue;
				}else {
					permissions2.add(bnPermission);
					break;
				}
			}
		}
		return permissions2;
	}
	
	
	//为用户赋予角色
	public void updateRoleGivenUserByUPkId(BnUsers user) {
		//先删除用户角色
		authorityMapper.deleteRoleByUPkId(user);
		if(user.getRoles() != null && user.getRoles().size()>0){
			//再添加用户角色
			authorityMapper.insertRoleByUPkId(user);
		}
	}
	//为角色授权
	public void updatePermissionGivenRoleByRPkId(BnRole role) {
		authorityMapper.deletePermissionByRPkId(role);
		if(role.getPermissions() != null && role.getPermissions().size()>0){
			//再添加用户角色
			authorityMapper.insertPermissionByRPkId(role);
		}
	}
	
	//根据rId修改角色内容
	public Integer updateRoleByRPkId(BnRole role) {
		return authorityMapper.updateRoleByRPkId(role);
	}
	//修改pId权限内容
	public Integer updatePermissionByPPkId(BnPermission permission) {
		return authorityMapper.updatePermissionByPPkId(permission);
	}
	
	//添加角色
	public Integer insertPermission(BnPermission permission) {
		return authorityMapper.insertPermission(permission);
	}
	
	//添加权限
	public Integer insertRole(BnRole role) {
		return authorityMapper.insertRole(role);
	}
	
	//查询所有用户
	public List<BnUsersVO> queryUsersByPage(PageUtil page) {
		
		List<BnUsersVO> queryUsersByPage = authorityMapper.queryUsersByPage(page);
		//数据脱敏
		for (BnUsersVO bnUsersVO : queryUsersByPage) {
			String getuUsername = bnUsersVO.getuUsername();
			String first = getuUsername.substring(0, 1);
			String last = getuUsername.substring(1, getuUsername.length()-1);
			StringBuilder sb = new StringBuilder();
			for(int i = 0;i < last.length()-1; i++) {
				sb.append("*");
			}
			if(sb.length() == 0) {
				sb.append("****");
			}
			getuUsername = first+sb;
			bnUsersVO.setuUsername(getuUsername);
			
			
			String getuPhone = bnUsersVO.getuPhone();
			String start = getuPhone.substring(0, 3);
			String end = getuPhone.substring(6, getuPhone.length()-1);
			bnUsersVO.setuPhone(start+"****"+end);
			
			
			String getuEmail = bnUsersVO.getuEmail();
			String[] split = getuEmail.split("@");
			String s1 = split[0].substring(0, 1);
			String s2 = split[0].substring(1, split[0].length()-1);
			StringBuilder sb2 = new StringBuilder();
			for(int i = 0;i < s2.length()-1; i++) {
				sb2.append("*");
			}
			if(sb2.length() == 0) {
				sb2.append("****");
			}
			bnUsersVO.setuEmail(s1+sb2+"@"+split[1]);
		}
		
		return queryUsersByPage;
	}
		
	public Integer updateUserState(BnUsers user) {
		// TODO Auto-generated method stub
		return authorityMapper.updateUserState(user);
	}
	public Integer updateUserInfo(BnUsers user) {
		
		return authorityMapper.updateUserInfo(user);
	}
	public List<BnPermission> queryPermissionsByRPkId(Integer rId) {
		return authorityMapper.queryPermissionsByRPkId(rId);
	}
	public Integer deleteRole(Integer rPkId) {
		return authorityMapper.deleteRole(rPkId);
	}
	public Integer deletePermissionByPPkId(Integer pPkId) {
		return authorityMapper.deletePermissionByPPkId(pPkId);
	}
	public void deletePermissions(List<BnPermission> permissions) {
		authorityMapper.deletePermissions(permissions);
	}
	public void deleteRoles(List<BnRole> roles) {
		authorityMapper.deleteRoles(roles);
		
	}
	public List<BnPermission> permissionsByPage(PageUtil page) {
		// TODO Auto-generated method stub
		return authorityMapper.permissionsByPage(page);
	}
}
