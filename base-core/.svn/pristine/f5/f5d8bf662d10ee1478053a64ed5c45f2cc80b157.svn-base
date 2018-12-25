package com.bnsilu.service;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.bnsilu.entity.BnPermission;
import com.bnsilu.entity.BnRole;
import com.bnsilu.entity.BnUsers;

@RunWith(SpringJUnit4ClassRunner.class) //使用junit4进行测试
@ContextConfiguration(locations={"classpath:application-config.xml"})
@Rollback(value = true)
@Transactional(transactionManager="transactionManager")
public class TestAuthorityService {
	@Autowired
	private AuthorityService authorityService;
	
	@Test
	public void testQueryRoles() {
//		List<BnRole> queryRoles = authorityService.queryRoles();
//		System.out.println(queryRoles);
	}
	@Test
	public void testQueryRolesByBnPkId() {
		List<BnRole> queryRoles = authorityService.queryRolesByUPkId(2);
		System.out.println(queryRoles);
	}
	@Test
	public void testQueryPermissions() {
		List<BnPermission> queryPermissions = authorityService.queryPermissions();
		System.out.println(queryPermissions);
	}
	@Test
	public void testQueryPermissionsByBnPkId() {
		List<BnPermission> queryPermissions = authorityService.queryPermissionsByUPkId(2);
		System.out.println(queryPermissions);
	}
	@Test
	public void testUpdateRoleGivenUserByUPkId() {
		BnUsers user = new BnUsers();
		user.setuPkId(44);
		/*
		for (int i = 0; i < 3; i++) {
			BnRole role = new BnRole();
			role.setrPkId(i*10);
			user.getRoles().add(role);
		}
		*/
		authorityService.updateRoleGivenUserByUPkId(user);
		
	}
	
	@Test
	public void testUpdatePermissionGivenRoleByRPkId() {
		BnRole role = new BnRole();
		role.setrPkId(44);
		/*
		for (int i = 0; i < 2; i++) {
			BnPermission per = new BnPermission();
			per.setpPkId(i*10);
			role.getPermissions().add(per);
		}
		*/
		authorityService.updatePermissionGivenRoleByRPkId(role);
		
	}
	
	@Test
	@Rollback(value=false)
	public void testInsertPermission() {
		BnPermission per = new BnPermission();
		per.setpRemark("测试权限");
		per.setpUrl("/test/test");
		authorityService.insertPermission(per);
		
	}
	@Test
	@Rollback(value=false)
	public void testInsertRole() {
		BnRole role = new BnRole();
		role.setrPkId(44);
		role.setrName("老大");
		role.setrRemark("就是吊");
		
		authorityService.insertRole(role);
	}
	@Test
	@Rollback(value=false)
	public void testUpdateRoleByRPkId() {
		BnRole role = new BnRole();
		role.setrPkId(5);
		role.setrName("老大555");
		role.setrRemark("就是吊555");
		
		authorityService.updateRoleByRPkId(role);
	}
	@Test
	@Rollback(value=false)
	public void testUpdatePermissionByRPkId() {
		BnPermission per = new BnPermission();
		per.setpPkId(4);
		per.setpRemark("测试权限aaa");
		per.setpUrl("/test/test");
		
		authorityService.updatePermissionByPPkId(per);
	}
	
	
}
