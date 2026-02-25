<?php $this->display('inc_top.php') ?>
<script type="text/javascript">
$(function(){
	$('.chazhao').click(function(){
		$(this).closest('form').submit();
	});
	
	$('.search input[name=username]')
	.focus(function(){
		//console.log(this.value);
		if(this.value=='使用者名稱') this.value='';
	})
	.blur(function(){
		if(this.value=='') this.value='使用者名稱';
	})
	.keypress(function(e){
		if(e.keyCode==13) $(this).closest('form').submit();
	});
	
	$('.bottompage a[href]').live('click', function(){
		$('.biao-cont').load($(this).attr('href'));
		return false;
	});
	
	$('.sure[id]').click(function(){
		var $this=$(this),
		cashId=$this.attr('id'),
		
		call=function(err, data){
			if(err){
				alert(err);
			}else{
				this.parent().text('已到帳');
			}
		}
		
		$.ajax('/index.php/cash/toCashSure/'+cashId,{
			dataType:'json',
			
			error:function(xhr, textStatus, errThrow){
				call.call($this, errThrow||textStatus);
			},
			
			success:function(data, textStatus, xhr){
				var errorMessage=xhr.getResponseHeader('X-Error-Message');
				if(errorMessage){
					call.call($this, decodeURIComponent(errorMessage), data);
				}else{
					call.call($this, null, data);
				}
			}
		});
	});
});
function teamBeforeSearchCashRecord(){}
function teamSearchCashRecord(err, data){
	if(err){
		alert(err);
	}else{
		$('.biao-cont').html(data);
	}
}
</script>
 <meta name="viewport" 
        content="width=device-width,initial-scale=1,
        minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <!--强制浏览器以竖屏的布局来显示页面，
        缩放比例为1，最小缩放值为1，最大缩放值为1，用户缩放设置为不允许-->
        
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <!-- 删除苹果默认的工具栏和菜单栏 -->
        
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <!-- 设置苹果工具栏颜色 -->
        
        <meta name="format-detection" content="telephone=no, email=no" />
        <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
        

        <meta name="renderer" content="webkit">
        <!-- 启用360浏览器的极速模式(webkit) -->
        
      
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- 避免IE使用兼容模式 -->
        
        <meta name="HandheldFriendly" content="true">
        <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
        
        <meta name="MobileOptimized" content="320">
        <!-- uc强制竖屏 -->
        
        <!--<meta name="screen-orientation" content="portrait">-->
        <!-- QQ强制竖屏 -->    
        
        <meta name="x5-orientation" content="portrait">
        <!-- UC强制全屏 -->
        
        <!--<meta name="full-screen" content="yes">-->
        <!-- QQ强制全屏 -->
        
        <meta name="x5-fullscreen" content="true">
        <!-- UC应用模式 -->
        
        <meta name="browsermode" content="application">
        <!-- QQ应用模式 -->
        
        <meta name="x5-page-mode" content="app">
        <style> #dailinav {
		width: 100%;
		}
		.pagemain {
    margin-bottom: 13px;
    padding: 5px 5px 5px 5px;
    width: 100%;
		}
		#dailinav li {
    line-height: 40px;
		padding: 7px}
	.pagemain input.datainput{
    width: 118px;
}
		</style>
<div class="pagemain">
	<div class="search">
		<form action="/index.php/team/searchCashRecord" target="ajax" onajax="teamBeforeSearchCashRecord" call="teamSearchCashRecord" dataType="html">
       
       <select name="type">
            <option value="0" selected>所有人</option>
            <option value="1">我自己</option>
            <option value="2">直屬下線</option>
            <option value="3">所有下線</option>
        </select>
       <input height="20" value="用户名" name="username"/><br/>
        时间：<input type="text" name="fromTime" class="datainput"  value="<?=$this->iff($_REQUEST['fromTime'],$_REQUEST['fromTime'],date('Y-m-d',$GLOBALS['fromTime']))?>"/>至<input type="text" name="toTime"  class="datainput" value="<?=$this->iff($_REQUEST['toTime'],$_REQUEST['toTime'],date('Y-m-d',$GLOBALS['toTime']))?>"/>
         
      <input type="button" value="查 詢" class="btn chazhao">
  </form> 
    </div>
    <div class="display biao-cont">
    	<!--内容列表-->
        <?php $this->display('team/cash-record-list.php'); ?>
        <!--内容列表 end -->
    </div>

</div>
<!--以下为模板代码-->
</div></div></div>
</body></html>
  
 