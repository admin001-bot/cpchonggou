<?php
$this->freshSession();
if($this->user['uid']){
$rechargeId=$this->getRechId();
$uid=$this->user['uid'];
$amount=floatval($_POST['amount']);
$cfgId=$_POST['cfgId'];
$time=date('Y-m-d H:i:s', time());
$username=$_POST['username'];
$depositTime=$_POST['depositTime'];
	if($amount && $uid && $rechargeId && $depositTime && $username){
		$para=array();
		$para['amount']=$amount;
		$para['rechargeId']=$rechargeId;
		$para['actionTime']=$this->time;
		$para['uid']=$this->user['uid'];
		$para['username']=$this->user['username'];
		$para['actionIP']=$this->ip(true);
		if ($cfgId == 288) {
            $para['info']='微信掃碼儲值①';
            $para['depositinfo']='微信暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='weixin';
		} else if($cfgId == 288) {
            $para['info']='微信掃碼儲值①';
            $para['depositinfo']='微信暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='weixin';	
		} else if($cfgId == 289) {
            $para['info']='微信掃碼儲值②';
            $para['depositinfo']='微信暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='weixin1';	
		} else if($cfgId == 280) {
            $para['info']='QQ錢包支付儲值';
            $para['depositinfo']='使用者暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='cft';	
        } else if($cfgId == 281) {
            $para['info']='支付寶掃碼支付儲值①';
            $para['depositinfo']='支付寶暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='alipay';
        } else if($cfgId == 282) {
            $para['info']='支付寶掃碼支付儲值②';
            $para['depositinfo']='支付寶暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='alipay1';
        }else if ($cfgId == 290) {
            $para['info']='银行转账充值';
            $para['depositinfo']='附言：'.$_POST['code'].'<br>金融卡帳號:'.$username.'<br>存款方式：'.$_POST['type'].'<br>存款時間:'.$depositTime;
            $para['rechType']='bankTransfer';
        } else {
            $para['info']='支付寶轉帳充值';
            $para['depositinfo']='支付寶暱稱:'.$username.'<br>存款時間:'.$depositTime;
            $para['rechType']='alipay';
        }

		if($this->insertRow($this->prename .'member_recharge', $para)){
			echo '存款資料提交成功，請等待客服審核';
			exit;
		}else{
			echo '提交失敗,請聯絡客服處理';
			exit;
		}		
	}else{
			echo '提交失敗';
			exit;
		}	
}
?>