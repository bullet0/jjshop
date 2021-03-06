package com.bnsilu.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.bnsilu.entity.BnPermission;
import com.bnsilu.entity.BnRole;
import com.bnsilu.entity.BnUsers;
import com.bnsilu.entity.BnUsersVO;
import com.bnsilu.entity.ResponseMsg;
import com.bnsilu.exception.RegexException;
import com.bnsilu.service.AuthorityService;
import com.bnsilu.util.PageUtil;
import com.google.gson.Gson;

@RestController
@RequestMapping("/authority")
public class AuthorityController {
	
	@Autowired
	private AuthorityService authorityService;
	
	//获取当前登录用户信息
	@RequestMapping(value="/userInfo",method= {RequestMethod.GET})
    @ResponseBody
    //@RequiresPermissions(value="/authority/userInfo")
    public Object queryUserInfo(HttpServletRequest req) throws RegexException {
    	HttpSession session = req.getSession();
    	Object userInfo = session.getAttribute("userInfo");
    	ResponseMsg msg = new ResponseMsg();
    	msg.setState(200);
    	msg.setBody(userInfo);
    	msg.setMsg("用户数据返回成功");
    	return msg;
    }
	
	//查看所有角色
	@RequestMapping(value = "/roles",method= {RequestMethod.GET})
	//@RequiresPermissions({"/authority/roles"})
	public ResponseMsg queryRolesByPage(PageUtil page) {
		
		List<BnRole> roles = authorityService.queryRolesByPage(page);
		page.setList(roles);

		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("查询角色成功");
		msg.setBody(page);
		Gson g = new Gson();
		String json = g.toJson(msg);
		System.out.println(json);
		
		return msg;
	}
	
	//查看当前用户的角色
	@RequestMapping(value = "/role/{uId}",method= {RequestMethod.GET})
	//@RequiresPermissions({"/authority/role/"})
	public ResponseMsg queryRoleByUPkId(@PathVariable(value = "uId") Integer uId) {
		
		List<BnRole> roles = authorityService.queryRolesByUPkId(uId);

		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("查询角色成功");
		msg.setBody(roles);
		
		return msg;
	}
	
	
	//查询所有用户信息
	@RequestMapping(value = "/users",method= {RequestMethod.GET})
	//@RequiresPermissions({"/authority/users"})
	public ResponseMsg queryUsersByPage(PageUtil page) {
		
		List<BnUsersVO> bnUsers = authorityService.queryUsersByPage(page);
		page.setList(bnUsers);
		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("查询用户成功");
		msg.setBody(page);
		
		return msg;
	}
	
	
	//激活、禁用用户
	@RequestMapping(value = "/user/{uId}/{state}",method= {RequestMethod.PUT})
	//@RequiresPermissions({"/user/"})
	public ResponseMsg updateUserState(@PathVariable(value = "uId") Integer uId,@PathVariable(value = "state") Integer state) {
		BnUsers user = new BnUsers();
		user.setuPkId(uId);
		user.setuState(state);
		Integer result = authorityService.updateUserState(user);
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("用户状态修改成功");
		}else {
			msg.setState(500);
			msg.setMsg("用户状态修改失败");
		}
		return msg;
	}
	
	
	
	
	
	//用户信息修改
	@RequestMapping(value = "/user/{uPkId}",method= {RequestMethod.PUT})
	//@RequiresPermissions({"/user/"})
	public ResponseMsg updateUserInfo(@PathVariable(value="uPkId") Integer uId,@RequestBody BnUsers user) {
		user.setuPkId(uId);
		Integer result = authorityService.updateUserInfo(user);
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("用户状态修改成功");
		}else {
			msg.setState(500);
			msg.setMsg("用户状态修改失败");
		}
		return msg;
	}
	
	//根据角色id查询角色对应权限
	@RequestMapping(value = "/permissions/role/{rPkId}",method= {RequestMethod.GET})
	//@RequiresPermissions({"/authority/users"})
	public ResponseMsg queryPermissionsByRPkId(@PathVariable(value="rPkId") Integer rId) {
		
		List<BnPermission> permissions =  authorityService.queryPermissionsByRPkId(rId);
		
		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("查询权限成功");
		msg.setBody(permissions);
		
		return msg;
	}
	
	//根据用户id查询用户对应权限
	@RequestMapping(value = "/permissions/user/{uPkId}",method= {RequestMethod.GET})
	//@RequiresPermissions({"/authority/users"})
	public ResponseMsg queryPermissionsByUPkId(@PathVariable(value="uPkId") Integer uId) {
		
		List<BnPermission> permissions =  authorityService.queryPermissionsByUPkId(uId);
		
		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("查询权限成功");
		msg.setBody(permissions);
		
		return msg;
	}
	
	//角色添加
	@RequestMapping(value = "/role",method= {RequestMethod.POST})
	//@RequiresPermissions({"/authority/users"})
	public ResponseMsg insertRole(@RequestBody BnRole role) {
		Integer result = authorityService.insertRole(role);
		
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("角色添加成功");
		}else {
			msg.setState(500);
			msg.setMsg("角色添加失败");
		}
		return msg;
	}
	
	//角色修改
	@RequestMapping(value = "/role/{rPkId}",method= {RequestMethod.PUT})
	//@RequiresPermissions({"/role/"})
	public ResponseMsg updateRole(@PathVariable(value="rPkId") Integer rId, @RequestBody BnRole role) {
		role.setrPkId(rId);
		Integer result = authorityService.updateRoleByRPkId(role);
		
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("角色修改成功");
		}else {
			msg.setState(500);
			msg.setMsg("角色修改失败");
		}
		return msg;
	}
	
	//角色删除
	@RequestMapping(value = "/role/{rPkId}",method= {RequestMethod.DELETE})
	//@RequiresPermissions({"/role/"})
	public ResponseMsg deleteRole(@PathVariable(value="rPkId") Integer rId) {
		
		Integer result = authorityService.deleteRole(rId);
		
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("角色删除成功");
		}else {
			msg.setState(500);
			msg.setMsg("角色删除失败");
		}
		return msg;
	}
	
	//用户绑定角色
	@RequestMapping(value = "/user/role/{uPkId}",method= {RequestMethod.PUT})
	//@RequiresPermissions({"/role/"})
	public ResponseMsg updateRoleGivenUserByUPkId(@PathVariable(value="uPkId") Integer uId,@RequestBody BnUsers user) {
		user.setuPkId(uId);
		authorityService.updateRoleGivenUserByUPkId(user);
		
		ResponseMsg msg = new ResponseMsg();
		
		msg.setState(200);
		msg.setMsg("用户绑定角色成功");

		return msg;
	}
	
	
	//角色授权
	@RequestMapping(value = "/role/permissions/{rPkId}",method= {RequestMethod.PUT})
	//@RequiresPermissions({"/role/"})
	public ResponseMsg updatePermissionGivenRoleByRPkId(@PathVariable(value="rPkId") Integer rId,@RequestBody BnRole role) {
		role.setrPkId(rId);
		authorityService.updatePermissionGivenRoleByRPkId(role);
		
		ResponseMsg msg = new ResponseMsg();
		
		msg.setState(200);
		msg.setMsg("角色授权成功");

		return msg;
	}
	
	//分页查看所有权限
	@RequestMapping(value = "/permissionsByPage",method = {RequestMethod.GET})
	//@RequiresPermissions({"/permissions"})
	public ResponseMsg permissionsByPage(PageUtil page) {
		
		List<BnPermission> permissions = authorityService.permissionsByPage(page);
		page.setList(permissions);
		ResponseMsg msg = new ResponseMsg();
		msg.setState(200);
		msg.setMsg("权限查询成功");
		msg.setBody(page);
		return msg;
	}
	
	//查看所有权限
	@RequestMapping(value = "/permissions",method = {RequestMethod.GET})
	//@RequiresPermissions({"/permissions"})
	public ResponseMsg queryPermissions() {
		
		List<BnPermission> permissions = authorityService.queryPermissions();
		
		ResponseMsg msg = new ResponseMsg();
		
		msg.setState(200);
		msg.setMsg("权限查询成功");
		msg.setBody(permissions);
		return msg;
	}
	//添加权限
	@RequestMapping(value = "/permission",method = {RequestMethod.POST})
	//@RequiresPermissions({"/permission"})
	public ResponseMsg insertPermission(@RequestBody BnPermission permission) {
		
		Integer result = authorityService.insertPermission(permission);
		
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("权限添加成功");
		}else {
			msg.setState(500);
			msg.setMsg("权限添加失败");
		}
		return msg;
	}
	//修改权限
	@RequestMapping(value = "/permission/{pPkId}",method = {RequestMethod.PUT})
	//@RequiresPermissions({"/permission"})
	public ResponseMsg updatePermission(@PathVariable(value="pPkId") Integer pPkId,@RequestBody BnPermission permission) {
		permission.setpPkId(pPkId);
		Integer result = authorityService.updatePermissionByPPkId(permission);
		
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("权限修改成功");
		}else {
			msg.setState(500);
			msg.setMsg("权限修改失败");
		}
		return msg;
	}
	
	//删除权限
	@RequestMapping(value = "/permission/{pPkId}",method = {RequestMethod.DELETE})
	//@RequiresPermissions({"/permission"})
	public ResponseMsg deletePermission(@PathVariable(value="pPkId") Integer pPkId) {
		Integer result = authorityService.deletePermissionByPPkId(pPkId);
		
		ResponseMsg msg = new ResponseMsg();
		if(result == 1) {
			msg.setState(200);
			msg.setMsg("权限删除成功");
		}else {
			msg.setState(500);
			msg.setMsg("权限删除失败");
		}
		return msg;
	}
	//批量删除权限
	@RequestMapping(value = "/permissions",method = {RequestMethod.DELETE})
	//@RequiresPermissions({"/permission"})
	public ResponseMsg deletePermissions(@RequestBody List<BnPermission> permissions) {
		
		if(permissions != null && permissions.size()>0) {
			authorityService.deletePermissions(permissions);
		}
		
		ResponseMsg msg = new ResponseMsg();
		
		msg.setState(200);
		msg.setMsg("权限批量删除成功");
		
		return msg;
	}
	
	//批量删除角色
	@RequestMapping(value = "/roles",method = {RequestMethod.DELETE})
	//@RequiresPermissions({"/permission"})
	public ResponseMsg deleteRoles(@RequestBody List<BnRole> roles) {
		
		if(roles != null && roles.size()>0) {
			authorityService.deleteRoles(roles);
		}
		
		ResponseMsg msg = new ResponseMsg();
		
		msg.setState(200);
		msg.setMsg("角色批量删除成功");
		
		return msg;
	}
}
