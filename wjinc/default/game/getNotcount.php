<?php
$pagenum=1;
$pagesize=50;
$gametype=$this->getPage("select * from {$this->prename}type order by sort asc",$pagenum,$pagesize);

if($gametype){
	$allarr=array();
	foreach($gametype['data'] as $key => $var){
	$gameId=$var['id'];
	$sql=" and type={$gameId}";
	if($this->user['testFlag']==1){
$list=$this->getRow("select type as gameId, sum(totalNums)  totalNums, sum(money * totalNums) totalMoney from {$this->prename}guestbets where isDelete=0 and lotteryNo='' and uid={$this->user['uid']} {$sql}");
	}else{
$list=$this->getRow("select type as gameId, sum(totalNums)  totalNums, sum(money * totalNums) totalMoney from {$this->prename}bets where isDelete=0 and lotteryNo='' and uid={$this->user['uid']} {$sql}");
	}	
	if($list['gameId'] && $list['totalMoney']){
	$list['gameId']=intval($list['gameId']);
	$list['totalNums']=intval($list['totalNums']);
	$list['totalMoney']=intval($list['totalMoney']);
	array_push($allarr, $list);
	}
	}
	echo json_encode($allarr);
}
?>