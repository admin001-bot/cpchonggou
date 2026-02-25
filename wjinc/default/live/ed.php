<?php

header("Content-type: text/html; charset=utf-8");

include_once('biapi/ApiBi/BiApi.class.php');
include_once('live/mysqli.php');
$api=new BiApi();
$uid = intval(@$this->user['uid']);
$username = @$this->user['username'];
		$sqlc = "select * from ssc_members where username='{$username}'";
			$result = $mysqli->query($sqlc);
			$row=$result->fetch_array();
			$user_money=$row['coin'];
$game=strtoupper($_GET['game']);
$type=$_GET['type'];
$money=$_GET['zz_money'];
$user=($this->user);
if(!$username){
	echo "<script>alert('請登入後再試！');</scrip>";exit;
}
if(in_array(['in','out'],$type))exit('轉換類型有誤');
if($money<1)exit('最低1USD');
if($type=='in'){
	if($money>$user_money)exit('您的網站餘額不足');
	//必须榜卡
	$sql ="select * from ssc_member_bank where uid=$uid";
	
	$res = $mysqli->query($sql);
			$res=$res->fetch_array();
			if(!$res)exit('請先綁銀行卡');
			$bankId=$res['bankId'];
	$result=$api->zzmoney($game,$username,$type,$money);
	if($result){
		//扣钱
		$sql="update ssc_members set coin=(coin-{$money}) where username='$username'";
		$mysqli->query($sql);
		//帐变提现
		
		$time=time();
		$sql="insert into ssc_member_cash(uid,actionTime,amount,bankId,account,username,state,info) values ('{$this->user['uid']}','$time','$money','$bankId','$game','轉入{$game}','0','轉入{$game}')";
		
		$mysqli->query($sql);
	}
}else{
	//获取余额
	$res=$api->balances($game,$username,'','','');	
	if(!$res)exit('獲取失敗');
	if((float)$res<$money or (float)$res==0 )exit('您的遊戲平台餘額不足');
	$result=$api->zzmoney($game,$username,$type,$money);
	if($result){
		//加钱
		$sql="update ssc_members set coin=(coin+{$money}) where username='$username'";
		$mysqli->query($sql);
		//帐变充值
		$rechargeId=time().mt_rand(0,1000);
		$time=time();
		$sql="insert into ssc_member_recharge(uid,rechargeId,username,amount,coin,actionIP,actionTime,info,depositinfo,rechType,state) values ('{$this->user['uid']}','$rechargeId','{$this->user['username']}','$money','$user_money','127.0.0.1','$time','從{$game}平台轉出','從{$game}平台轉出','alipay','2')";
		$mysqli->query($sql);
	}
}
		
	
	
	exit($result==true?'轉換成功':'轉換失敗');
?>	