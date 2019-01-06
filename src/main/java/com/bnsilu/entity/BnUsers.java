package com.bnsilu.entity;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class BnUsers {
	private Integer uPkId;
	private String uUsername;
	private String uPassword;
	private String uPhone;
	private String uEmail;
	private Timestamp uCreateTime;
	private Timestamp uLastTime;
	private String uSalt;
	private Integer uState;

	private List<BnRole> roles = new ArrayList<>();
	
	
	
	public List<BnRole> getRoles() {
		return roles;
	}
	public void setRoles(List<BnRole> roles) {
		this.roles = roles;
	}
	public Integer getuPkId() {
		return uPkId;
	}
	public void setuPkId(Integer uPkId) {
		this.uPkId = uPkId;
	}
	public String getuUsername() {
		return uUsername;
	}
	public void setuUsername(String uUsername) {
		this.uUsername = uUsername;
	}
	public String getuPassword() {
		return uPassword;
	}
	public void setuPassword(String uPassword) {
		this.uPassword = uPassword;
	}
	public String getuPhone() {
		return uPhone;
	}
	public void setuPhone(String uPhone) {
		this.uPhone = uPhone;
	}
	public String getuEmail() {
		return uEmail;
	}
	public void setuEmail(String uEmail) {
		this.uEmail = uEmail;
	}
	public Timestamp getuCreateTime() {
		return uCreateTime;
	}
	public void setuCreateTime(Timestamp uCreateTime) {
		this.uCreateTime = uCreateTime;
	}
	public Timestamp getuLastTime() {
		return uLastTime;
	}
	public void setuLastTime(Timestamp uLastTime) {
		this.uLastTime = uLastTime;
	}
	public String getuSalt() {
		return uSalt;
	}
	public void setuSalt(String uSalt) {
		this.uSalt = uSalt;
	}
	
	public Integer getuState() {
		return uState;
	}
	public void setuState(Integer uState) {
		this.uState = uState;
	}
	@Override
	public String toString() {
		return "BnUsers [uPkId=" + uPkId + ", uUsername=" + uUsername + ", uPassword=" + uPassword + ", uPhone="
				+ uPhone + ", uEmail=" + uEmail + ", uCreateTime=" + uCreateTime + ", uLastTime=" + uLastTime
				+ ", uSalt=" + uSalt + ", uState=" + uState + "]";
	}
	
	
	
	  
}
