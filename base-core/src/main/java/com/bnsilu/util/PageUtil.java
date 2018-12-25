package com.bnsilu.util;

import java.util.List;


public class PageUtil {
	//每页条数  默认十条
	private int pageSize = 3;
	//当前页码
	private int curPage = 1;
	//总条数
	private int totalCount;
	//总页数
	private int totalPage;
	//条件         
	private String condition = "";
	//数据集合
	private List list;
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	
	public int getCurPage() {
		return curPage;
	}
	public void setCurPage(int curPage) {
		this.curPage = curPage;
	}
	public int getTotalCount() {
		return totalCount;
	}
	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}
	public int getTotalPage() {
		return totalPage;
	}
	public void setTotalPage() {
		if(this.totalCount % this.pageSize == 0){
			this.totalPage = this.totalCount / this.pageSize;
		}else {
			this.totalPage = this.totalCount / this.pageSize + 1;
		}
	}
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
	public List getList() {
		return list;
	}
	public void setList(List list) {
		this.list = list;
	}
	
}
