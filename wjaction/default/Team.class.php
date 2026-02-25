<?php
@session_start();
class Team extends WebLoginBase{
	public $pageSize=15;
	private $vcodeSessionName='ssc_vcode_session_name';

	public function getMyUserCount1(){
		$this->getSystemSettings();
		$minFanDian=$this->user['fanDian'] - 10 * $this->settings['fanDianDiff'];
		$sql="select count(*) registerUserCount, fanDian from {$this->prename}members where parentId={$this->user['uid']} and fanDian>=$minFanDian and fanDian<{$this->user['fanDian']} group by fanDian order by fanDian desc";
		$data=$this->getRows($sql);
		
		$ret=array();
		$fanDian=$this->user['fanDian'];
		$i=0;
		$set=explode(',', $this->settings['fanDianUserCount']);
		
		while(($fanDian-=$this->settings['fanDianDiff']) && ($fanDian>=$minFanDian)){
			$arr=array();
			if($data[0]['fanDian']==$fanDian){
				$arr=array_shift($data);
			}else{
				$arr['fanDian']=$fanDian;
				$arr['registerUserCount']=0;
			}
			
			$arr['setting']=$set[$i];
			//var_dump($fanDian);
			$ret["$fanDian"]=$arr;
			
			$i++;
		}
		
		return ($ret);
	}
	
	public function getMyUserCount(){
		if(!$set=$this->settings['fanDianUserCount']) return array();
		$set=explode(',', $set);
		
		foreach($set as $key=>$var){
			$set[$key]=explode('|', $var);
		}
		
		foreach($set as $var){
			if($this->user['fanDian']>=$var[1]) break;
			array_shift($set);
		}
		
	}

	public final function onlineMember(){
		$this->display('team/member-online-list.php');
	}
	
	/*游戏记录*/
	public final function gameRecord(){
		$this->getTypes();
		$this->getPlayeds();
		$this->action='searchGameRecord';
		$this->display('team/record.php');
	}
	
	public final function searchGameRecord(){
		
		$this->getTypes();
		$this->getPlayeds();
		$this->display('team/record-list.php');
	}
	/*游戏记录 结束*/
	
	/*团队报表*/
	public final function report(){

		$this->action='searchReport';
		$this->display('team/report.php');
	}
	
	public final function searchReport(){
		
		$this->display('team/report-list.php');
	}
	/*团队报表 结束*/
	
	/*帐变列表*/
	public final function coin(){
		$this->action='searchCoin';
		$this->display('team/coin.php');
	}
	
	public final function searchCoin(){
		$this->display('team/coin-log.php');
	}
	/*帐变列表 结束*/
	
	public final function coinall(){
		$this->freshSession();
		$this->display('team/coinall.php');
	}
	
	public final function addMember(){
		
		$this->display('team/add-member.php');
	}
	public final function userUpdate($id){
		$this->display('team/update-menber.php', 0, intval($id));
	}
	public final function userUpdate2($id){
		$this->display('team/menber-recharge.php', 0, intval($id));
	}
	public final function memberList(){
		$this->display('team/member-list.php');
	}
	
	public final function cashRecord(){
		$this->display('team/cash-record.php');
	}
	
	public final function searchCashRecord(){
		$this->display('team/cash-record-list.php');
	}
	public final function addLink(){
		$this->display('team/add-link.php');
	}
	public final function linkDelete($lid){
		$this->display('team/delete-link.php',0,intval($lid));
	}
	public final function linkList(){
		$this->display('team/link-list.php');
	}
	public final function getLinkCode($id){
		$this->display('team/get-linkcode.php', 0, intval($id), $this->user['uid'], $this->urlPasswordKey);
	}
	public final function advLink(){
		$this->display('team/link-list.php');
	}

	public final function insertLink(){
		if(!$_POST)  throw new Exception('提交資料出錯，請重新操作');

        $update['uid']=intval($_POST['uid']);
		$update['type']=intval($_POST['type']);
		$update['fanDian']=floatval($_POST['fanDian']);
		$update['regIP']=$this->ip(true);
		$update['regTime']=$this->time;

        if($update['fanDian']<0) throw new Exception('返點不能小於0');
		if($update['fanDian']>$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff'])) throw new Exception('返點不能大於'.$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff']));
		if($update['type']!=0 && $update['type']!=1) throw new Exception('類型出錯，請重新操作');
		if($update['uid']!=$this->user['uid']) throw new Exception('只能增加自己的推廣鏈接!');
		
		// 查检返点设置
		if($update['fanDian']){
			$this->getSystemSettings();
			if($update['fanDian'] % $this->settings['fanDianDiff']) throw new Exception(sprintf('返點只能是%.1f%的倍數', $this->settings['fanDianDiff']));
			
		}else{
			$update['fanDian']=0.0;
		}
		
		$this->beginTransaction();
		try{
			$sql="select fanDian from {$this->prename}links where uid={$update['uid']} and fanDian=? ";
			
			if($this->getValue($sql, $update['fanDian'])) throw new Exception('此連結已經存在');
			if($this->insertRow($this->prename .'links', $update)){
				$id=$this->lastInsertId();	
				$this->commit();
				return '添加連結成功';
			}else{
				throw new Exception('新增連結失敗');
			}
			
		}catch(Exception $e){
			$this->rollBack();
			throw $e;
		}
	}
	
	/*编辑注册链接*/
	public final function linkUpdate($id){
		$this->display('team/update-link.php', 0, intval($id));
	}
	
	public final function linkUpdateed(){
		if(!$_POST)  throw new Exception('提交資料出錯，請重新操作');

		$update['lid']=intval($_POST['lid']);
        $update['fanDian']=floatval($_POST['fanDian']);
		$lid=$update['lid'];

		if($update['fanDian']<0) throw new Exception('返點不能小於0');
		if($update['fanDian']>$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff'])) throw new Exception('返點不能大於'.$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff']));
        if($uid=$this->getvalue("select uid from {$this->prename}links where lid=?",$lid)){
		     if($uid!=$this->user['uid']) throw new Exception('只能修改自己的推廣鏈接!');
		}else{
			throw new Exception('此註冊連結不存在');
			}
		
		if(!$_POST['fanDian']){unset($_POST['fanDian']);unset($update['fanDian']);}
		if($update['fanDian']==0) $update['fanDian']=0.0;

		if($this->updateRows($this->prename .'links', $update, "lid=$lid")){
			echo '修改成功';
		}else{
			throw new Exception('未知出錯');
		}
		
	}
	
	/*删除注册链接*/
	public final function linkDeleteed(){
		$lid=intval($_POST['lid']);
		if($uid=$this->getvalue("select uid from {$this->prename}links where lid=?",$lid)){
		     if($uid!=$this->user['uid']) throw new Exception('只能刪除自己的推廣鏈接!');
		}else{
			throw new Exception('此註冊連結不存在');
			}
		$sql="delete from {$this->prename}links where lid=?";
		if($this->delete($sql, $lid)){
			echo '刪除成功';
		}else{
			throw new Exception('未知出错');
		}
	}

	public final function searchMember(){
		$this->display('team/member-search-list.php');
	}
	
	public final function insertMember(){
		if(!$_POST) throw new Exception('提交資料出錯，請重新操作');

        //过滤未知字段
		$update['username']=wjStrFilter($_POST['username']);
		$update['qq']=wjStrFilter($_POST['qq']);
		$update['fanDian']=floatval($_POST['fanDian']);
		$update['password']=$_POST['password'];
		$update['type']=intval($_POST['type']);
        
		//接收参数检查
		if(strtolower($_POST['vcode'])!=$_SESSION[$this->vcodeSessionName]) throw new Exception('驗證碼不正確。');
		//清空验证码session
	    unset($_SESSION[$this->vcodeSessionName]);
		if($update['fanDian']<0) throw new Exception('返點不能小於0');
		if($update['fanDian']>$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<=0,0,$this->user['fanDian']-$this->settings['fanDianDiff'])) throw new Exception('返點不能大於'.$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff']));
		if(!$update['username']) throw new Exception('使用者名稱不能為空，請重新操作');
		if($update['type']!=0 && $update['type']!=1  && $update['type']!=2 && $update['type']!=3) throw new Exception('類型出錯，請重新操作');

		if(!ctype_alnum($update['username'])) throw new Exception('使用者名稱包含非法字元,請重新輸入');
		if(!ctype_digit($update['qq'])) throw new Exception('QQ包含非法字符');

		$userlen=strlen($update['username']);
		$passlen=strlen($update['password']);
		$qqlen=strlen($update['qq']);

		if($userlen<4 || $userlen>16) throw new Exception('使用者名稱長度不正確,請重新輸入');
		if($passlen<6) throw new Exception('密碼至少六位,請重新輸入');
		if($qqlen<4 || $qqlen>13) throw new Exception('QQ號為4-12位,請重新輸入');

		$update['xuni'] = 0;
		$update['coin']=0;
		$update['fcoin']=0;
		$update['score']=0;
		$update['scoreTotal']=0;
		$update['src']="代理添加";
		if($this->user['type']==1){ 
		$update['parentId']=$this->user['uid'];
		$update['zparentId']=$this->user['zparentId'];
		$update['gudongId']=$this->user['gudongId'];
		}elseif($this->user['type']==2){ 
		$update['zparentId']=$this->user['uid'];
		$update['gudongId']=$this->user['gudongId'];
		}elseif($this->user['type']==3){ 		
		$update['gudongId']=$this->user['uid'];
		}
		$update['password']=md5($update['password']);
		$update['regIP']=$this->ip(true);
		$update['regTime']=$this->time;
		
		if(!$_POST['nickname']) $update['nickname']='未設暱稱';
		if(!$_POST['name']) $update['name']='';
		
		// 查检返点设置
		if($update['fanDian']){
			$this->getSystemSettings();
			if($update['fanDian'] % $this->settings['fanDianDiff']) throw new Exception(sprintf('返點只能是%.1f%的倍數', $this->settings['fanDianDiff']));
			
			/*$count=$this->getMyUserCount();
			$sql="select userCount, (select count(*) from {$this->prename}members m where m.parentId={$this->user['uid']} and m.fanDian=s.fanDian) registerCount from {$this->prename}params_fandianset s where s.fanDian={$update['fanDian']}";
			$count=$this->getRow($sql);			
			if($count && $count['registerCount']>=$count['userCount']) throw new Exception(sprintf('对不起返点为%.1f的下级人数已经达到上限', $update['fanDian']));*/
		}else{
			$update['fanDian']=0.0;
		}
		
		$this->beginTransaction();
		try{
			$sql="select username from {$this->prename}members where username=?";
			if($this->getValue($sql, $update['username'])) throw new Exception('用户“'.$update['username'].'”已經存在');
			if($this->insertRow($this->prename .'members', $update)){
				//$id=$this->lastInsertId();
				//$sql="update {$this->prename}members set parents=concat(parents, ',', $id) where `uid`=$id";
				//$this->update($sql);
				
				$this->commit();
				
				return '新增會員成功';
			}else{
				throw new Exception('新增會員失敗');
			}
			
		}catch(Exception $e){
			$this->rollBack();
			throw $e;
		}
	}
	
	public final function userUpdateed(){
		if(!$_POST) throw new Exception('提交資料出錯，請重新操作');
        
		//过滤未知字段
		$update['type']=intval($_POST['type']);
		$update['uid']=intval($_POST['uid']);
		$update['fanDian']=floatval($_POST['fanDian']);
		$uid=$update['uid'];

        if($update['fanDian']<0) throw new Exception('返點不能小於0');
		$fandian=$this->getvalue("select fanDian from {$this->prename}members where uid=?",$update['uid']);
		if($update['fanDian']<$fandian) throw new Exception('返點不能降低!');
		if($update['fanDian']>$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff'])) throw new Exception('返點不能大於'.$this->iff($this->user['fanDian']-$this->settings['fanDianDiff']<0,0,$this->user['fanDian']-$this->settings['fanDianDiff']));
		if($update['type']!=0 && $update['type']!=1) throw new Exception('類型出錯，請重新操作');

		if($uid==$this->user['uid']) throw new Exception('不能修改自己的返點');
		if(!$parentId=$this->getvalue("select parentId from {$this->prename}members where uid=?",$uid)) throw new Exception('此會員不存在!');
		if($parentId!=$this->user['uid']) throw new Exception('此會員不是你的直屬下線，無法修改');

		if(!$_POST['fanDian']){unset($_POST['fanDian']);unset($update['fanDian']);}
		if($update['fanDian']==0) $update['fanDian']=0.0;
		
		if($this->updateRows($this->prename .'members', $update, "uid=$uid")){
			echo '修改成功';
		}else{
			throw new Exception('未知出错');
		}
		
	}
	
 /*额度转移*/
	public final function userUpdateed2(){
		if(!$para=$_POST) throw new Exception('提交資料出錯，請重新操作');

        $this->getSystemSettings();
        if($this->settings['recharge']!=1) throw new Exception('上級儲值功能已經關閉！');
		$uid=intval($para['uid']);
		$uid2=$this->user['uid'];
		$para['coin']=floatval($para['coin']);
		if($para['coin']<1 || $para['coin']>10000) throw new Exception('只能儲值1-10000USD');

		$this->beginTransaction();
		try{
		$sql="select * from {$this->prename}members where uid=?";
		$userData=$this->getRow($sql, $uid2);
        if(!$userData2=$this->getRow($sql, $uid)) throw new Exception('此會員不存在!');
		
		if($this->user['type']==1){ 
		if($userData2['parentId']!=$uid2) throw new Exception('此會員不是的你的直屬會員，請重新選擇！');
		}elseif($this->user['type']==2){ 
		if($userData2['zparentId']!=$uid2 || $userData2['parentId']) throw new Exception('此會員不是的你的直屬會員，請重新選擇！');
		}elseif($this->user['type']==3){ 		
		if($userData2['gudongId']!=$uid2 || $userData2['zparentId'] || $userData2['parentId']) throw new Exception('此會員不是的你的直屬會員，請重新選擇！');
		}
		
		if(!$userData2['enable']) throw new Exception('此會員已被凍結，無法轉移！');
		if($userData['coin']<=0) throw new Exception('餘額不足，請先儲值！');
		if($userData['coin']<$para['coin']) throw new Exception('可用餘額小於儲值金額，請先儲值！');
		$abc['coin']=$userData['coin']-$para['coin'];
        $def['coin']=$userData2['coin']+$para['coin'];
			$this->addCoin(array(
						'uid'=>$uid2,
						'coin'=>-$para['coin'],
						'liqType'=>110,
						'extfield0'=>0,
						'extfield1'=>0,
						'info'=>'給下級'.$userData2['username'].'儲值扣款金額'
					));	//上级充值成功扣款结束
			$this->addCoin(array(
						'uid'=>$uid,
						'coin'=>$para['coin'],
						'liqType'=>109,
						'extfield0'=>0,
						'extfield1'=>0,
						'info'=>'上級'.$userData['username'].'儲值金額'
					));	//上级充值结束

		$this->commit();
		echo '儲值成功';
		}catch(Exception $e){
			$this->rollBack();
			throw $e;
		}
	}
	public final function shareBonus(){
		$this->display('team/share-bonus.php');
	}

	public final function shareBonusInfo(){
		$this->display('team/share-bonus-info.php');
	}

	public final function getShareBonus(){
		$uid = $this->user['uid'];
		if(!$uid) die('參數出錯');
		$sql = 'select * from ssc_bonus_log where uid='.$this->user['uid'].' and bonusStatus = 0 order by id DESC Limit 1';
		$lastBonus = $this->getRow($sql);
		if($lastBonus){
			//直接将用户分红提现，提现信息提交至后台
			$bank=$this->getRow("select * from {$this->prename}member_bank where uid=? limit 1",$this->user['uid']);
			if($bank['bankId']){
				$para['username']=$bank['username'];
				$para['account']=$bank['account'];
				$para['bankId']=$bank['bankId'];
		$this->beginTransaction();
		try{
			$this->freshSession();
			// 插入提现请求表
			$para['actionTime']=$this->time;
			$para['uid']=$this->user['uid'];
			$para['info']= '分紅提現';
			$para['amount'] = $lastBonus['bonusAmount'];
			if(!$this->insertRow($this->prename .'member_cash', $para)) throw new Exception('領取分紅請求出錯');
			if(!$this->updateRows($this->prename .'bonus_log', array('bonusStatus'=>1), 'id='.$lastBonus['id'])) throw new Exception('領取分紅請求出錯');
			$id=$this->lastInsertId();
			
			$this->commit();
			echo '分紅提現成功，分紅提現將在10分鐘內到帳，如未到賬請聯絡線上客服。';
		
		}catch(Exception $e){
			$this->rollBack();
			throw $e;
		}
			}else{
				die('您尚未設定銀行帳戶，不可領取分紅！！！');
			}
		}else{
			die('您本期沒有可分紅金額或您已經領取了本期分紅！！！');
		}
	}
}