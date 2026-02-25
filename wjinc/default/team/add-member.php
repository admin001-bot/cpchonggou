<?php $this->display('inc_top.php') ?>
<script type="text/javascript">
function khao(fanDian){
	$('input[name=fanDian]').val(fanDian);
	return false;
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
<div class="pagemain">
	
    <div class="display biao-cont">
		<form action="/index.php/team/insertMember" method="post" target="ajax" onajax="teamBeforeAddMember" call="teamAddMember">

<table width="100%" border="0" cellspacing="1" cellpadding="4" class='table_b'>
    <tr class='table_b_th'>
      <td align="left" style="font-weight:bold;padding-left:10px;" colspan=2>新增成員</td> 
    </tr>
    
    <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">帳號類型：</td>
      <td align="left" ><?php if($this->user['type']==3){ ?>
      <label><input type="radio" name="type" value="2" title="總代理" style="width:auto;" />總代理</label>
      <?php }
	  if($this->user['type']==3 || $this->user['type']==2){ ?>     
      <label><input type="radio" name="type" value="1" title="代理" style="width:auto;" />代理</label>
      <?php } ?>
      <label><input name="type" type="radio" value="0" title="會員" style="margin-left:10px;width:auto;"  />會員</label></td> 
    </tr>  
    <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">使用者名稱：</td>
      <td align="left" ><input name="username"  value="" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"/><span style="color:#000; margin-left:10px;">使用者名稱由4-16位的字母或數字組成</span></td> 
    </tr> 
     <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">密碼：</td>
      <td align="left" ><input name="password" type="password"  value="" /></td> 
    </tr>  
     <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">確認密碼：</td>
      <td align="left" ><input id="cpasswd" type="password" value="" /></td> 
    </tr> 
     <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">联系 Q Q：</td>
      <td align="left" ><input name="qq" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"/></td> 
    </tr> 
    <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">返點%：</td>
      <td align="left" ><input name="fanDian" max="<?=$this->user['fanDian']?>" value=""  fanDianDiff=<?=$this->settings['fanDianDiff']?> onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"/><span style="color:#000; margin-left:10px;">0-<?=$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<=0,0,$this->user['fanDian']-$this->settings['fanDianDiff'])?>%</span></td> 
    </tr>
	<tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;">驗證碼：</td>
      <td align="left" ><input name="vcode" type="text" style="ime-mode: disabled; width: 75px;" /><b class="yzmNum"><img width="58" height="24" border="0" style="cursor:pointer;margin-bottom:0px;" id="vcode" alt="看不清？點選更換" align="absmiddle" src="/index.php/user/vcode/<?=$this->time?>" title="看不清楚，換張圖片" onclick="this.src='/index.php/user/vcode/'+(new Date()).getTime()"/></b></td>
    </tr>
     <tr height=25 class='table_b_tr_b'>
      <td align="right" style="font-weight:bold;"></td>
      <td align="left"><input type="submit" id='put_button_pass' class="btn addbtn" value="增加成員" >
        <input type="reset" value="重置" class="btn"/> </td> 
    </tr> 
</table> 
</form>
    </div><div class="table_b" style="margin-top:-30px;">
						<?php
						$sql="select s.*, (select count(*) from {$this->prename}members m where m.parentId={$this->user['uid']} and m.fanDian=s.fanDian) registerUserCount from {$this->prename}params_fandianset s where s.fanDian<={$this->user['fanDian']}  order by s.fanDian desc";
						//echo $sql;
						if($data=$this->getRows($sql)){ ?>
                    	<table width="100%">
                        	<tr class="table_b_th">
								<td>返點</td>
								<td>報名人數</td>
								<td>剩餘人數</td>
								<td>操作</td>
                            </tr>
							<?php foreach($data as $var){ if($var['userCount']-$var['registerUserCount']){?>
							<tr class="table_b_tr">
								<td><?=$var['fanDian']?></td>
								<td><?=$var['registerUserCount']?></td>
								<td><?=$var['userCount']-$var['registerUserCount']?></td>
								<td>
									<?php if($var['userCount']-$var['registerUserCount']>0 or true){ ?>
										<a href="javascript:;" onclick="khao(<?=$var['fanDian']?>, <?=$var['bFanDian']?>)">開號</a>
									<?php }else{ ?>
										--
									<?php } ?>
								</td>
							</tr>
							<?php } }?>
                        </table>
						
						<?php } ?>

                    </div>
					
</div>
<!--以下为模板代码-->
</div></div></div>
<div id="wanjinDialog"></div>
</body></html>
  
 