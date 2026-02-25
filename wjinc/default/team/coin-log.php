<?php
	$this->getTypes();
	$this->getPlayeds();
	
	// 日期限制
	if($_REQUEST['fromTime'] && $_REQUEST['toTime']){
		$timeWhere=' and l.actionTime between '. strtotime($_REQUEST['fromTime']).' and '.strtotime($_REQUEST['toTime']);
	}elseif($_REQUEST['fromTime']){
		$timeWhere=' and l.actionTime >='. strtotime($_REQUEST['fromTime']);
	}elseif($_REQUEST['toTime']){
		$timeWhere=' and l.actionTime <'. strtotime($_REQUEST['toTime']);
	}else{
		
		if($GLOBALS['fromTime'] && $GLOBALS['toTime']) $timeWhere=' and l.actionTime between '.$GLOBALS['fromTime'].' and '.$GLOBALS['toTime'].' ';
	}
	
	// 帐变类型限制
	if($_REQUEST['liqType']=intval($_REQUEST['liqType'])){
		$liqTypeWhere=' and liqType='.$_REQUEST['liqType'];
		if($_REQUEST['liqType']==2) $liqTypeWhere=' and liqType between 2 and 3';
	}
	
	// 用户类型限制
	if($_REQUEST['username'] && $_REQUEST['username']!='使用者名稱'){
		$_REQUEST['username']=wjStrFilter($_REQUEST['username']);
		if(!ctype_alnum($_REQUEST['username'])) throw new Exception('使用者名稱包含非法字元,請重新輸入');
		$userWhere=" and (u.parentId={$this->user['uid']} or u.zparentId={$this->user['uid']} or u.gudongId={$this->user['uid']} ) and u.username like '%{$_REQUEST['username']}%'";
	}

	if($_REQUEST['userType']=intval($_REQUEST['userType'])){
		switch($_REQUEST['userType']){

			case 1:
				$userWhere=" and u.uid={$this->user['uid']}";
			break;
			case 2:
				if($this->user['type']==1){
				$userWhere=" and u.parentId={$this->user['uid']} and u.type=0 ";
				}elseif($this->user['type']==2){
				$userWhere=" and u.zparentId={$this->user['uid']} and u.type=1 or (u.zparentId={$this->user['uid']} and u.parentId='' and u.type=0) ";
				}elseif($this->user['type']==3){
				$userWhere=" and u.gudongId={$this->user['uid']} and u.type=2 or (u.gudongId={$this->user['uid']} and u.zparentId='' and u.parentId='' and u.type!=3) ";
				}
			break;
			case 3:
				$userWhere=" and (u.parentId={$this->user['uid']} or u.zparentId={$this->user['uid']} or u.gudongId={$this->user['uid']} ) and u.uid!={$this->user['uid']}";
			break;

		}
	}else{
				if($this->user['type']==1){
				$userWhere=" and u.parentId={$this->user['uid']} and u.type=0 ";
				}elseif($this->user['type']==2){
				$userWhere=" and u.zparentId={$this->user['uid']} and u.type=1 or (u.zparentId={$this->user['uid']} and u.parentId='' and u.type=0) ";
				}elseif($this->user['type']==3){
				$userWhere=" and u.gudongId={$this->user['uid']} and u.type=2 or (u.gudongId={$this->user['uid']} and u.zparentId='' and u.parentId='' and u.type!=3) ";
				}
	}
	
	// 冻结查询
	if($this->action=='fcoinModal'){
		$fcoinModalWhere='and l.fcoin!=0';
	}
	
	$sql="select b.type, b.playedId, b.actionNo, l.liqType, l.coin, l.fcoin, l.userCoin, l.actionTime, l.extfield0, l.extfield1, l.info, u.username from {$this->prename}members u, {$this->prename}coin_log l left join {$this->prename}bets b on b.id=extfield0 where l.uid=u.uid $liqTypeWhere $timeWhere $userWhere $typeWhere $fcoinModalWhere and l.liqType not in(4,11,104) order by l.id desc";
	//echo $sql;
	
	$list=$this->getPage($sql, $this->page, $this->pageSize);
	$params=http_build_query($_GET, '', '&');
	$liqTypeName=array(
		1=>'儲值',
		2=>'返點',
		//3=>'返点',//分红
		//4=>'抽水金额',
		5=>'停止追號',
		6=>'中獎金額',
		7=>'撤銷單',
		8=>'提現失敗返回凍結金額',
		9=>'管理員儲值',
/*		10=>'解除抢庄冻结金额',
		//11=>'收单金额',
		12=>'上级充值',
		13=>'上级充值成功扣款',
		
		100=>'抢庄冻结金额',*/
		101=>'投注凍結金額',
		//103=>'抢庄返点金额',
		//104=>'抢庄抽水金额',
		105=>'退水資金',
		106=>'提現凍結',
		107=>'提現成功扣除凍結金額',
		108=>'開獎扣除凍結金額',
		109=>'上級儲值',
		110=>'給下級儲值扣款'
	);
	
?>
<div>
<table width="100%" class='table_b'>
	<thead>
		<tr class="table_b_th">
			<td>時間</td>
			<td>使用者名稱</td>
			<td>帳變類型</td>
			<td>單號</td>
			<td>遊戲</td>
			<td>玩法</td>
			<td>期號</td>
			<td>資金</td>
			<td>餘額</td>
		</tr>
	</thead>
	<tbody class="table_b_tr">
		<?php if($list['data']) foreach($list['data'] as $var){ ?>
		<tr>
			<td><?php echo substr(date('Y-m-d H:i:s', $var['actionTime']),2)?></td>
			<td><?=$var['username']?></td>
			<td><?=$liqTypeName[$var['liqType']]?></td>
			<!-- <td><?//=$var['info']?></td> -->
			
			<?php if($var['extfield0'] && in_array($var['liqType'], array(2,3,4,5,6,7,10,11,100,101,102,103,104,105,108))){ ?>
                <td><a href="/index.php/record/betInfo/<?=$var['extfield0']?>" title="投注資訊" target="modal"><?=$this->getValue("select wjorderId from {$this->prename}bets where id=?", $var['extfield0'])?></a>
                </td>
                <td><?=$this->types[$var['type']]['shortName']?></td>
                <td><?=$this->playeds[$var['playedId']]['name']?></td>
                <td><?=$var['actionNo']?></td>
			<?php }elseif(in_array($var['liqType'], array(1,9,52))){?>
                <td><?=$var['extfield1']?></td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
  
			<?php }elseif(in_array($var['liqType'], array(8,106,107))){?>
                <td><?=$var['extfield0']?></td>
                <td>--</td>
                <td>--</td>
                <td>--</td>

                
            <?php }else{ ?>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>

            <?php } ?>
            
            <td><?=$var['coin']?></td>
			
			<td><?=$var['userCoin']?></td>
		</tr>
		<?php } ?>
	</tbody>
</table>
<?php 
	$this->display('inc_page.php',0,$list['total'],$this->pageSize, "/index.php/{$this->controller}/{$this->action}-{page}/{$this->type}?$params");
?>
</div>