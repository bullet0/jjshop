package com.bnsilu.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class BnRole{
	private Integer rPkId;
	private String rName;
	private String rRemark;
	private List<BnPermission> permissions = new ArrayList<>();
	
	public List<BnPermission> getPermissions() {
		return permissions;
	}
	public void setPermissions(List<BnPermission> permissions) {
		this.permissions = permissions;
	}
	
	public Integer getrPkId() {
		return rPkId;
	}
	public void setrPkId(Integer rPkId) {
		this.rPkId = rPkId;
	}
	public String getrName() {
		return rName;
	}
	public void setrName(String rName) {
		this.rName = rName;
	}
	public String getrRemark() {
		return rRemark;
	}
	public void setrRemark(String rRemark) {
		this.rRemark = rRemark;
	}
	@Override
	public String toString() {
		return "BnRole [rPkId=" + rPkId + ", rName=" + rName + ", rRemark=" + rRemark + "]";
	}
	
	
}
