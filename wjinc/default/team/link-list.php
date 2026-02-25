<?php $this->display('inc_top.php') ?>
<!--//复制程序 flash+js-->
<script type="text/javascript" src="/skin/js/swfobject.js"></script>
<script language="JavaScript">
function Alert(msg) {
	alert(msg);
}
function thisMovie(movieName) {
	 if (navigator.appName.indexOf("Microsoft") != -1) {   
		 return window[movieName];   
	 } else {   
		 return document[movieName];   
	 }   
 } 
function copyFun(ID) {
	thisMovie(ID[0]).getASVars($("#"+ID[1]).attr('value'));
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
		</style>
<!--//复制程序 flash+js------end-->
<div class="pagemain">
	<div class="search">

      <input type="button" value="添加連結" style="width:120px" class="btn" onclick="window.location='/index.php/team/addlink'">
    </div>
    <div class="display biao-cont">
    	<?php
	$sql="select * from {$this->prename}links where uid={$this->user['uid']}";
	
	$data=$this->getPage($sql, $this->page, $this->pageSize);
	?>
	<table width="100%" class='table_b'>
	<thead>
		<tr class="table_b_th">
			<td>編號</td>
            <td>類型</td>
			<td>返點</td>
			<td>操作</td>
		</tr>
	</thead>
	<tbody class="table_b_tr">
	<?php if($data['data']) foreach($data['data'] as $var){ ?>
		<tr>
			<td><?=$var['lid']?></td>
			<td><?php if($var['type']){echo'代理商';}else{echo '會員';}?></td>
			<td><?=$var['fanDian']?>%</td>
           
			<td><a href="/index.php/team/linkUpdate/<?=$var['lid']?>" style="color:#333;" target="modal"  width="420" title="修改註冊連結" modal="true" button="確定:dataAddCode|取消:defaultCloseModal">修改</a> | <a href="/index.php/team/getLinkCode/<?=$var['lid']?>" button="取消:defaultCloseModal" modal="true" title="獲取連結" width="420" target="modal"  style="color:#333;">獲取連結</a> | <a  href="/index.php/team/linkDelete/<?=$var['lid']?>" button="確定刪除:dataAddCode" modal="true" title="刪除註冊連結" width="420" target="modal"  style="color:#333;">刪除</a> </td>
           
		</tr>
	<?php } ?>
	</tbody>
</table>
	<?php 
        $this->display('inc_page.php',0,$data['total'],$this->pageSize, '/index.php/team/linkList-{page}');
    ?>
    </div>

</div>
<!--以下为模板代码-->
</div></div></div>
<div id="wanjinDialog"></div>
<script language="javascript">function copy(message) {        
var input = document.createElement("input");       
     input.value = message;        
         document.body.appendChild(input);      
               input.select();          
                 input.setSelectionRange(0, input.value.length), document.execCommand('Copy');  
                          // document.body.removeChild(input);         
                             alert("複製成功", "text");}
                             </script>
{/block}
</body></html>
  
  
   
 