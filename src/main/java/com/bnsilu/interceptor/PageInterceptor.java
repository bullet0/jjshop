package com.bnsilu.interceptor;

import java.util.Properties;
import org.apache.ibatis.executor.resultset.ResultSetHandler;  
import org.apache.ibatis.executor.statement.StatementHandler;  
import org.apache.ibatis.mapping.BoundSql;  
import org.apache.ibatis.mapping.MappedStatement;  
import org.apache.ibatis.plugin.*;  
import org.apache.ibatis.reflection.MetaObject;  
import org.apache.ibatis.reflection.SystemMetaObject;

import com.bnsilu.util.PageUtil;

import java.sql.*;  


@Intercepts({
	 @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class,Integer.class}),  
	 @Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})
})  
public class PageInterceptor implements Interceptor {  
  
	//插件运行的代码，它将代替原有的方法
	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		
        if (invocation.getTarget() instanceof StatementHandler) {  
            StatementHandler statementHandler = (StatementHandler) invocation.getTarget();  
            MetaObject metaStatementHandler = SystemMetaObject.forObject(statementHandler);  
            MappedStatement mappedStatement=(MappedStatement) metaStatementHandler.getValue("delegate.mappedStatement");
            String selectId=mappedStatement.getId();
            
            if(selectId.substring(selectId.lastIndexOf(".")+1).endsWith("ByPage")){
            	BoundSql boundSql = (BoundSql) metaStatementHandler.getValue("delegate.boundSql");  
                // 分页参数作为参数对象parameterObject的一个属性  
                String sql = boundSql.getSql();
                PageUtil pageUtil=(PageUtil)(boundSql.getParameterObject());
                
                // 重写sql  
                String countSql=concatCountSql(sql);
                String pageSql=concatPageSql(sql,pageUtil);
                
                System.out.println("重写的 count  sql		:"+countSql);
                System.out.println("重写的 select sql		:"+pageSql);
                
                Connection connection = (Connection) invocation.getArgs()[0];  
                
                PreparedStatement ps = null;  
                ResultSet rs = null;  
                int totalCount = 0;  
                try { 
                	ps = connection.prepareStatement(countSql);
                	String str1=countSql.replace("?",""); //将字符串中i替换为空,创建新的字符串
                	int i = countSql.length()-str1.length();
                	for (int j = 0; j < i; j++) {
                		ps.setString(j+1, pageUtil.getCondition());
					}
                	rs = ps.executeQuery();  
                	if (rs.next()) {  
                		totalCount = rs.getInt(1);  
                	} 
                	
                } catch (SQLException e) {  
                	System.out.println("Ignore this exception"+e);  
                } finally {  
                	try {  
                		rs.close();  
                		ps.close();  
                	} catch (SQLException e) {  
                		System.out.println("Ignore this exception"+ e);  
                	}  
                }  
                
                metaStatementHandler.setValue("delegate.boundSql.sql", pageSql);            
              
        		//绑定count
                pageUtil.setTotalCount(totalCount);
                pageUtil.setTotalPage();
            }
        } 
        
		return invocation.proceed();
	}
	
	/**
     * 拦截类型StatementHandler 
     */
	@Override
	public Object plugin(Object target) {
		if (target instanceof StatementHandler) {  
            return Plugin.wrap(target, this);  
        } else {  
            return target;  
        }  
	}
	
	@Override
	public void setProperties(Properties properties) {
		
	}  
	
	
	public String concatCountSql(String sql){
		StringBuffer sb=new StringBuffer("select count(*) from ");
		sql=sql.toLowerCase();
		
		if(sql.lastIndexOf("order")>sql.lastIndexOf(")")){
			sb.append(sql.substring(sql.indexOf("from")+4, sql.lastIndexOf("order")));
		}else{
			sb.append(sql.substring(sql.indexOf("from")+4));
		}
		return sb.toString();
	}
	
	public String concatPageSql(String sql,PageUtil pageUtil){
		StringBuffer sb=new StringBuffer();
		sb.append(sql);
		sb.append(" limit ").append((pageUtil.getCurPage()-1)*pageUtil.getPageSize()).append(" , ").append(pageUtil.getPageSize());
		return sb.toString();
	}
	
	public void setPageCount(){
		
	}
	
}  