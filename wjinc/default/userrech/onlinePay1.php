<?php
$this->freshSession();
if($this->user['uid']){
$rechargeId=$this->getRechId();
$bankid=intval($_REQUEST["payId"]);
$uid=$this->user['uid'];
$amount=floatval($_REQUEST['amount']);
$time=date('Y-m-d H:i:s', time());

if($amount && $uid && $rechargeId){
	if($this->update("INSERT INTO {$this->prename}order (order_number, username, recharge_amount, state, time) VALUES('{$rechargeId}', '{$uid}', '{$amount}', '0', '{$time}')")){
		$para=array();
		$para['mBankId']=intval($bankid);
		$para['amount']=floatval($amount);
		$para['rechargeId']=$rechargeId;
		$para['actionTime']=$this->time;
		$para['uid']=$this->user['uid'];
		$para['username']=$this->user['username'];
		$para['actionIP']=$this->ip(true);
		if($bankid==758 || $bankid=='ZHIFUBAO'){
		$para['info']='支付寶掃碼儲值';
		}elseif($bankid==57 || $bankid==2){
		$para['info']='微信掃碼儲值';
		}else{
		$para['info']='用戶線上儲值';
		}
		if($this->insertRow($this->prename .'member_recharge', $para)){
			if($bankid==758 || $bankid==57){
				$url='?rechargeId='.$rechargeId.'&bankid='.$bankid.'&uid='.$uid.'&amount='.$amount;
				header("Location: http://game.22d22.com/req.php".$url); 
			}elseif($bankid=='ZHIFUBAO'){
				$return_params=3;
				$url='?order_no='.$rechargeId.'&bankid='.$bankid.'&uid='.$uid.'&order_amount='.$amount.'&return_params='.$return_params;
				header("Location: http://www.ylgj77.com/req.php".$url); 
			}elseif( $bankid==2){
				$return_params=2;
				$url='?order_no='.$rechargeId.'&bankid='.$bankid.'&uid='.$uid.'&order_amount='.$amount.'&return_params='.$return_params;
				header("Location: http://www.ylgj77.com/reqwx.php".$url); 
			}else{
				$url='?MerBillNo='.$rechargeId.'&BankCode='.$bankid.'&Attach='.$this->user['username'].'&Amount='.$amount;
				header("Location: /qfpay/req.php".$url); 				
			}
		}else{
			echo '儲值訂單產生出錯';
			exit;
		}		
	}else{
	echo '操作錯誤';
	exit;	
	}
}
}
?>