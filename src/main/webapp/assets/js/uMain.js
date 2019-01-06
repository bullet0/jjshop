$(document).ready(function() {
	//ifream点击变化
	$('.submenu>li').click(function(){
		$(this).addClass("active");
		$(this).siblings('li').removeClass("active");
	});
	$('.nav-list>li').click(function(){
		$(this).siblings('li').removeClass("active");
		$(this).addClass('active');		
	})
	
})