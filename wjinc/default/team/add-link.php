<?php $this->display('inc_top.php') ?>
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
		</style>
<div class="pagemain">
	
    <div class="display biao-cont">
    <form action="/index.php/team/insertLink" method="post" target="ajax" onajax="teamBeforeAddLink" call="teamAddLink">
<input name="uid" type="hidden" id="uid" value="<?=$this->user['uid']?>" />
<table width="100%" border="0" cellspacing="1" cellpadding="4" class='table_b'>
    <tr class='table_b_th'>
      <td align="left" style="font-weight:bold;padding-left:10px;" colspan=2>新增註冊連結</td> 
    </tr>
    
    <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">帳號類型：</td>
      <td align="left" >
      <?php if($this->user['type']==3){ ?>
      <label><input type="radio" name="type" value="2" title="總代理" style="width:auto;" />總代理</label>
      <?php }
	  if($this->user['type']==3 || $this->user['type']==2){ ?>     
      <label><input type="radio" name="type" value="1" title="代理" style="width:auto;" />代理</label>
      <?php } ?>
      <label><input name="type"  type="radio" value="0" title="會員" style="margin-left:30px;width:auto;" checked="checked" />會員</label></td> 
    </tr>
    <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">返點%：</td>
      <td align="left" ><input name="fanDian" max="<?=$this->user['fanDian']?>" value=""  fanDianDiff=<?=$this->settings['fanDianDiff']?> /><span style="color:#000; margin-left:10px;">0-<?=$this->user['fanDian']?>%</span></td> 
    </tr>
     <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;"></td>
      <td align="left"><input type="submit" id='put_button_pass' class="btn addbtn" value="增加連結" style="width:120px" >
        <input type="reset" value="重置" class="btn"/> </td> 
    </tr> 

   
</table> 
</form>
    </div>
</div>
<!--以下为模板代码-->
</div></div></div>
<div id="wanjinDialog"></div>
</body></html>
  
   
 