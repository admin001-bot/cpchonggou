<?php 

	$sql="select * from {$this->prename}links where lid=?";
	$linkData=$this->getRow($sql, $args[0]);
	
	if($linkData['uid']){
		$parentData=$this->getRow("select fanDian, username from {$this->prename}members where uid=?", $linkData['uid']);
	}else{
		$this->getSystemSettings();
		$parentData['fanDian']=$this->settings['fanDianMax'];
	}


	include_once $_SERVER['DOCUMENT_ROOT'].'/lib/classes/Xxtea.class';
	$key=Xxtea::encrypt($args[0].",".$args[1], $args[2]);
	$key=base64_encode($key);
	$key=str_replace(array('+','/','='), array('-','*',''), $key);
	
?><div>

	<table cellpadding="2" cellspacing="2" class="popupModal" style="font-size:14px;">
		
         <tr>
        	<td class="title">上級會員：</td>
			<td height="27"><?=$parentData['username']?></td>
        </tr>
		<tr>
			<td class="title">返點：</td>
			<td height="27"><?=$linkData['fanDian']?></td>
		</tr>
        <tr>
        	<td class="title">推廣連結：</td>
			<td height="27"><input class="t-c t-c-w1" id="adv-url" readonly value="http://<?=$_SERVER['HTTP_HOST']?>/index.php/user/r/<?=$key?>" style="width:270px"/></td>
        </tr>
        <tr>
        	<td class="title">&nbsp;</td>
			<td><div class="btn-a copy1">
                         <button type="button"  onclick="copy('http://<?=$_SERVER['HTTP_HOST']?>/index.php/user/r/<?=$key?>')">複製</button>
                            </div></td>
        </tr>
        
     
	</table>

</div>

