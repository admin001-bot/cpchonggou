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

<?php $this->display('/team/online-list.php'); ?> 


</div>
<!--以下为模板代码-->
</div></div></div>
<div id="wanjinDialog"></div>
</body></html>
  
  
   
