package com.bnsilu.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

//@JsonInclude(JsonInclude.Include.NON_NULL)
public class BnPermission {
	private Integer pPkId;
	private String pUrl;
	private String pRemark;
	  
	public Integer getpPkId() {
		return pPkId;
	}
	public void setpPkId(Integer pPkId) {
		this.pPkId = pPkId;
	}
	public String getpUrl() {
		return pUrl;
	}
	public void setpUrl(String pUrl) {
		this.pUrl = pUrl;
	}
	public String getpRemark() {
		return pRemark;
	}
	public void setpRemark(String pRemark) {
		this.pRemark = pRemark;
	}
	@Override
	public String toString() {
		return "BnPermission [pPkId=" + pPkId + ", pUrl=" + pUrl + ", pRemark=" + pRemark + "]";
	}
	  
	  
}
