<?php
	//echo $this->userType;
	$para=$_GET;
	
	if($para['state']==5){
		$whereStr = ' and b.isDelete=1 ';
	}else{
		$whereStr = ' and  b.isDelete=0 ';	
	}
	// 彩种限制
	if($para['type']=intval($para['type'])){
		$whereStr .= " and b.type={$para['type']}";
	}
	
	// 时间限制
	if($para['fromTime'] && $para['toTime']){
		$whereStr .= ' and b.actionTime between '.strtotime($para['fromTime']).' and '.strtotime($para['toTime']);
	}elseif($para['fromTime']){
		$whereStr .= ' and b.actionTime>='.strtotime($para['fromTime']);
	}elseif($para['toTime']){
		$whereStr .= ' and b.actionTime<'.strtotime($para['toTime']);
	}else{
		
		if($GLOBALS['fromTime'] && $GLOBALS['toTime']){
			$whereStr .= ' and b.actionTime between '.$GLOBALS['fromTime'].' and '.$GLOBALS['toTime'].' ';
		}
	}
	
	// 投注状态限制
	if($para['state']){
	switch($para['state']){
		case 1:
			// 已派奖
			$whereStr .= ' and b.zjCount>0';
		break;
		case 2:
			// 未中奖
			$whereStr .= " and b.zjCount=0 and b.lotteryNo!='' and b.isDelete=0";
		break;
		case 3:
			// 未开奖
			$whereStr .= " and b.lotteryNo=''";
		break;
		case 4:
			// 追号
			$whereStr .= ' and b.zhuiHao=1';
		break;
		case 5:
			// 撤单
			$whereStr .= ' and b.isDelete=1';
		break;
		}
	}
	
	 //单号
   if($para['betId'] && $para['betId']!='輸入單號'){
   $para['betId']=wjStrFilter($para['betId']);
   if(!ctype_alnum($para['betId'])) throw new Exception('單號包含非法字元,請重新輸入');
   $whereStr .= " and b.wjorderId='{$para['betId']}'";}

	// 用户名限制
		if($para['username'] && $para['username']!='使用者名稱'){
			$para['username']=wjStrFilter($para['username']);
			if(!ctype_alnum($para['username'])) throw new Exception('使用者名稱包含非法字元,請重新輸入');
			$whereStr .= " and u.username like '%{$para['username']}%' and (u.parentId={$this->user['uid']} or u.zparentId={$this->user['uid']} or u.gudongId={$this->user['uid']} ) ";
		}
		switch($para['utype']){
			case 1:
				//我自己
				$whereStr .= " and b.uid={$this->user['uid']} ";
				break;
			case 2:
				//直属下线
				if($this->user['type']==1){
				$whereStr.=" and u.parentId={$this->user['uid']} and u.type=0 ";
				}elseif($this->user['type']==2){
				$whereStr.=" and u.zparentId={$this->user['uid']} and u.type=1 or (u.zparentId={$this->user['uid']} and u.parentId='' and u.type=0) ";
				}elseif($this->user['type']==3){
				$whereStr.=" and u.gudongId={$this->user['uid']} and u.type=2 or (u.gudongId={$this->user['uid']} and u.zparentId='' and u.parentId='' and u.type!=3) ";
				}
				break;
			case 3:
				// 所有下级
				$whereStr .= "  and (u.parentId={$this->user['uid']} or u.zparentId={$this->user['uid']} or u.gudongId={$this->user['uid']} ) and u.uid !={$this->user['uid']} ";
				break;
			default:
				// 所有人
				$whereStr .= "  and (u.parentId={$this->user['uid']} or u.zparentId={$this->user['uid']} or u.gudongId={$this->user['uid']} ) ";
			break;
		}
	$sql="select b.*, u.username from {$this->prename}bets b, {$this->prename}members u where b.uid=u.uid";
	$sql.=$whereStr;
	$sql.=' order by id desc, actionTime desc';
	//echo $sql;
	$data=$this->getPage($sql, $this->page, $this->pageSize);

	$params=http_build_query($para, '', '&');
?>
<div>
<table width="100%" class='table_b'>
	<thead>
		<tr class="table_b_th">
			<td>編號</td>
            <td>使用者</td>
			<td>投注時間</td>
			<td>彩種</td>
			<td>期號</td>
			<td>玩法</td>
			<td>投注額(USD)</td>
			<td>獎金(USD)</td>
			<td>開獎號碼</td>
			<td>狀態</td>
		</tr>
	</thead>
	<tbody class="table_b_tr">
	<?php if($data['data']){ 
	foreach($data['data'] as $var){ ?>
		<tr>
			<td width="100">
				<a href="/index.php/record/betInfo/<?=$var['id']?>" title="投注資訊" button="關閉:defaultModalCloase" target="modal"><?=$var['wjorderId']?></a>
			</td>
            <td>
			<?
            if($var['username']){echo  $var['username'];}else{echo '--';};
            ?>
            </td>
			<td><?=date('m-d H:i:s', $var['actionTime'])?></td>
			<td><?=$this->ifs($this->types[$var['type']]['shortName'],$this->types[$var['type']]['title'])?></td>
			<td><?=$var['actionNo']?></td>
			<td><?=$this->playeds[$var['playedId']]['name']?></td>
			<td><?=$var['money']*$var['totalNums']?></td>
			<td><?=$this->iff($var['lotteryNo'], number_format($var['bonus'], 2), '0.00')?></td>
			<td width="100"><?=$this->ifs($var['lotteryNo'], '--')?></td>
			<td>
			<?php
				if($var['isDelete']==1){
					echo '<font color="#999999">已撤銷單</font>';
				}elseif(!$var['lotteryNo']){
					echo '<font color="#009900">未開獎</font>';
				}elseif($var['zjCount']){
					echo '<font color="red">已派獎</font>';
				}else{
					echo '未中獎';
				}
			?>
			</td>
		</tr>
	<?php } }else{ ?>
    <tr><td colspan="12">暫無投注訊息</td></tr>
    <?php } ?>
	</tbody>
</table>
<?php 
	$this->display('inc_page.php',0,$data['total'],$this->pageSize, "/index.php/{$this->controller}/{$this->action}-{page}/?$params");
?>
</div>