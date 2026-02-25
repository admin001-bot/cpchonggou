<?php
include_once 'Bet.class.php';
class Data extends WebLoginBase{
    
	//投注
	public final function postcode(){
		if($this->user['testFlag']==1){
			$this->guestpostcode();
		}else{
			if($this->user['panid']==1){
				$this->postcodea();
			}elseif($this->user['panid']==2){
				$this->postcodeb();
			}else{
				$this->postcodea();			
			}
		}
	}
public final function postcodea(){
    // header('content-Type: text/html;charset=utf-8');		
    $betBean = $_POST['betBean'];	
    $gameId = intval($_POST['gameId']);
    $turnNum = $_POST['turnNum'];
    // 移除客户端传递的 ftime
    // $postftime = $_POST['ftime'];
    $totalNums = intval($_POST['totalNums']);	
    $totalMoney = intval($_POST['totalMoney']);				
    $betinfo = array();
    $betinfo['success'] = false;
    $betinfo['msg'] = '';
    $betinfo['code'] = 0;

    $liqType = 101;
    $info = '投注';
    $this->getSystemSettings();
    $this->freshSession();
    
    // 检查系统设置
    if(intval($this->settings['switchBuy']) == 0){
        $betinfo['msg'] = '本平台已停止購買！';	
        echo json_encode($betinfo);
        exit;
    } elseif(intval($this->settings['switchDLBuy']) == 0 && $this->user['type'] == 1){
        $betinfo['msg'] = '代理不能投注！';	
        echo json_encode($betinfo); 
        exit;
    } elseif(intval($this->settings['switchZDLBuy']) == 0 && $this->user['type'] == 2){
        $betinfo['msg'] = '總代理不能投注！';	
        echo json_encode($betinfo); 
        exit;
    } elseif(intval($this->settings['switchGDBuy']) == 0 && $this->user['type'] == 3){
        $betinfo['msg'] = '股東不能投注！';	
        echo json_encode($betinfo); 
        exit;
    } elseif(count($betBean) == 0){
        $betinfo['msg'] = '請先選擇號碼再提交投注';	
        echo json_encode($betinfo); 
        exit;
    }

    // 基于服务器时间的验证
    $currentTime = $this->time; // 或使用 time()
    $ftime = $this->getTypeFtime($gameId);         // 封单时间
    $actionTime = $this->getGameActionTime($gameId); // 当期时间
    $actionNo = $this->getGameActionNo($gameId);     // 当期期数

    // 检查当前时间是否已经超过封单时间
    if ($currentTime > ($actionTime - $ftime)) {
        $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
        echo json_encode($betinfo); 
        exit;
    }

    // 检查投注期数是否正确
    if ($actionNo != $turnNum) {  
        $betinfo['msg'] = '投注失敗2：你投注第' . $actionNo . '已過購買時間';	
        echo json_encode($betinfo); 
        exit;
    }

    // 额外检查，确保投注时间仍然有效
    if (($actionTime - $ftime) < $currentTime) {  
        $betinfo['msg'] = '投注失敗3：你投注第' . $turnNum . '已過購買時間';	
        echo json_encode($betinfo); 
        exit;
    }

    // 检查投注金额和注数等其他逻辑
    // ... 保持不变 ...

    // 检查提交资料的时间是否有效，基于服务器时间
    // 之前的代码: elseif($postftime < $this->time){
    // 修改为基于服务器时间，不需要这个检查，因为已经在上面进行了验证

    // 检查游戏是否启用
    $gameenable = $this->getValue("select enable from {$this->prename}type where id={$gameId}");
    if($gameenable != 1){  
        $betinfo['msg'] = '遊戲已停用,請刷新再投';	
        echo json_encode($betinfo); 
        exit;
    } 

    // 查询用户可用资金
    $userAmount = $this->getValue("select coin from {$this->prename}members where uid={$this->user['uid']}");
    if($userAmount < $totalMoney){  
        $betinfo['msg'] = '您的可用資金不足，請先儲值';	
        echo json_encode($betinfo); 
        exit;
    } 

    // 检查注数
    if($totalNums < 1){  
        $betinfo['msg'] = '注數不能小於1，請重新投注';	
        echo json_encode($betinfo); 
        exit;
    }
    
    if($totalNums > 1000){  
        $betinfo['msg'] = '注數不能大於1000，請重新投注';	
        echo json_encode($betinfo); 
        exit;
    }
    
    if($totalMoney < 1){
        $betinfo['msg'] = '投注總金額不能小於1，請重新投注';	
        echo json_encode($betinfo); 
        exit;
    }

    // 查询当前期数已投注总额
    $actionNoMoney = $this->getValue("select sum(money * totalNums) from {$this->prename}bets where uid={$this->user['uid']} and type={$gameId} and actionNo={$actionNo}");
    
    // 查询用户单期投注总额限制		
    $usermaxTurnMoney = $this->getValue("select maxTurnMoney from {$this->prename}members where uid={$this->user['uid']}");
    if(($actionNoMoney + $totalMoney) > $usermaxTurnMoney && $usermaxTurnMoney){  
        $betinfo['msg'] = '您的單期投注金額只能小於' . $usermaxTurnMoney . ',現已投注' . $actionNoMoney;	
        echo json_encode($betinfo); 
        exit;
    } 

    // 检查每注的赔率和其他条件
    $this->getPlayeds();
    foreach($betBean as $code){
        // 基于服务器时间重新获取封单时间和当期时间
        $ftime2 = $this->getTypeFtime($gameId);          // 封单时间2
        $actionTime2 = $this->getGameActionTime($gameId); // 当期时间2
        $actionNo2 = $this->getGameActionNo($gameId);     // 当期期数2

        // 检查当前服务器时间是否已经超过封单时间
        if ($currentTime > ($actionTime2 - $ftime2)) {  
            $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
            echo json_encode($betinfo); 
            exit;
        }

        // 检查投注期数是否正确
        if ($actionNo2 != $turnNum) {  
            $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
            echo json_encode($betinfo); 
            exit;
        }

        // 额外检查，确保投注时间仍然有效
        if (($actionTime2 - $ftime2) < $currentTime) {  
            $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
            echo json_encode($betinfo); 
            exit;
        }

        // 检查玩法是否启用
        $played = $this->playeds[$code['playId']];
        if(!$played['enable']){  
            $betinfo['msg'] = '遊戲玩法已停用,請刷新再投' . $code['playId'];	
            echo json_encode($betinfo); 
            exit;
        }
        
        // 检查玩法ID是否正确
        if($played['id'] != intval($code['playId'])){  
            $betinfo['msg'] = '提交資料出錯，請重新投注';	
            echo json_encode($betinfo); 
            exit;
        }
        
        // 查询当前期数每个玩法已投注总额
        $code['playId'] = intval($code['playId']);
        $playsql = "select sum(money * totalNums) from {$this->prename}bets where uid={$this->user['uid']} and type={$gameId} and actionNo={$actionNo} and playedId={$code['playId']}";
        $playMoney = $this->getValue($playsql);
        
        // 查询玩法设置中的每期每个玩法的投注总额限制
        $maxcount = $this->getmaxcount($code['playId']);
        if(($playMoney + intval($code['money'])) > $maxcount['maxTurnMoney']){ 
            $playeds = $this->playeds[$code['playId']];
            $playedGroup = $this->playedGroup[$playeds['played_groupid']];
            $betinfo['msg'] = '遊戲玩法（' . $playedGroup['name'] . '-' . $playeds['name'] . '）每期金額只能小於' . $maxcount['maxTurnMoney'] . ',現已投注' . $playMoney;
            echo json_encode($betinfo); 
            exit;
        }
        
        // 查询用户单注投注金额限制
        $usermaxMoney = $this->getValue("select maxMoney from {$this->prename}members where uid={$this->user['uid']}");
        if($usermaxMoney < intval($code['money']) && $usermaxMoney){  
            $betinfo['msg'] = '您的單注金額只能小於' . $usermaxMoney;	
            echo json_encode($betinfo); 
            exit;
        } 
        
        // 检查单注最低金额
        if(floatval($code['money']) < $maxcount['minMoney']){  
            $betinfo['msg'] = '單注金額只能大於' . $maxcount['minMoney'] . '正整數';	
            echo json_encode($betinfo); 
            exit;
        }
    
        // 检查单注最高金额
        if(floatval($code['money']) > $maxcount['maxMoney']){  
            $betinfo['msg'] = '單注金額只能為小於' . $maxcount['maxMoney'] . '正整數';	
            echo json_encode($betinfo); 
            exit;
        }
    }		
    
    // 开始事务处理
    $this->beginTransaction();
    try{
        $randorderid = mt_rand(10000,99999);
        if(isset($turnNum)) unset($turnNum);
        // if(isset($postftime)) unset($postftime); // 已移除

        foreach($betBean as $code){
            // 插入投注表
            $code['wjorderId'] = date('YmdHis', $currentTime) . strval($this->createRandomStr(10));
            $code['orderId'] = strval(date('YmdHis', $currentTime)) . $randorderid;
            $code['money'] = floatval($code['money']);
            $amount = abs($code['money']);
            $played = $this->playeds[$code['playId']];
            $playedGroup = $this->playedGroup[$played['played_groupid']];
            $userrebate = ($this->user['rebate'] > 0) ? $this->user['rebate'] : $played['rebate'];

            $para = array(
                'wjorderId' => $code['wjorderId'],
                'orderId' => $code['orderId'],
                'serializeId' => uniqid(),
                'uid' => $this->user['uid'],
                'username' => $this->user['username'],
                'nickname' => $this->user['nickname'],
                'type' => $gameId,
                'playedGroup' => $played['played_groupid'],
                'playedId' => $played['id'],
                'Groupname' => $playedGroup['name'],
                //'playedname'=>$playeds['name'],
                'odds' => $played['odds'],
                'actionNo' => $actionNo,
                'actionTime' => $currentTime,
                'actionIP' => $this->ip(true),
                'actionData' => $played['name'],
                'rebate' => $userrebate,
                'money' => $code['money'],
                'kjTime' => $actionTime
            );
                
            // 判断是否复选
            if($code['betInfo']){
                $para['betInfo'] = $code['betInfo'];
                if($playedGroup['name'] != '連肖連尾'){
                    $para['totalMoney'] = $totalMoney;
                    $para['totalNums'] = $totalNums;
                    $amount = $totalMoney;
                }
            }
            $this->insertRow($this->prename .'bets', $para);

            // 添加用户资金流动日志
            $this->addCoin(array(
                'uid' => $this->user['uid'],
                'type' => $gameId,
                'playedId' => $para['playedId'],
                'liqType' => $liqType,
                'info' => $info,
                'extfield0' => $this->lastInsertId(),
                'extfield1' => $para['serializeId'],
                //'extfield2'=>$data['orderId'],
                'coin' => -$amount,
                //'fcoin'=>$amount
            ));
        }
        $this->commit();
        $betinfo['success'] = true;
        $betinfo['msg'] = '投注成功';
        echo json_encode($betinfo); 
    } catch(Exception $e){
        $this->rollBack();
        $betinfo['success'] = false;
        $betinfo['msg'] = '異常錯誤:'.$e->getMessage().'請聯絡管理員';	
        echo json_encode($betinfo); 
        exit;
    }
}

	
	public final function postcodeb(){
	    // header('content-Type: text/html;charset=utf-8');		
    $betBean = $_POST['betBean'];	
    $gameId = intval($_POST['gameId']);
    $turnNum = $_POST['turnNum'];
    // 移除客户端传递的 ftime
    // $postftime = $_POST['ftime'];
    $totalNums = intval($_POST['totalNums']);	
    $totalMoney = intval($_POST['totalMoney']);				
    $betinfo = array();
    $betinfo['success'] = false;
    $betinfo['msg'] = '';
    $betinfo['code'] = 0;

    $liqType = 101;
    $info = '投注';
    $this->getSystemSettings();
    $this->freshSession();
    
    // 检查系统设置
    if(intval($this->settings['switchBuy']) == 0){
        $betinfo['msg'] = '本平台已停止購買！';	
        echo json_encode($betinfo);
        exit;
    } elseif(intval($this->settings['switchDLBuy']) == 0 && $this->user['type'] == 1){
        $betinfo['msg'] = '代理不能投注！';	
        echo json_encode($betinfo); 
        exit;
    } elseif(intval($this->settings['switchZDLBuy']) == 0 && $this->user['type'] == 2){
        $betinfo['msg'] = '總代理不能投注！';	
        echo json_encode($betinfo); 
        exit;
    } elseif(intval($this->settings['switchGDBuy']) == 0 && $this->user['type'] == 3){
        $betinfo['msg'] = '股東不能投注！';	
        echo json_encode($betinfo); 
        exit;
    } elseif(count($betBean) == 0){
        $betinfo['msg'] = '請先選擇號碼再提交投注';	
        echo json_encode($betinfo); 
        exit;
    }

    // 基于服务器时间的验证
    $currentTime = $this->time; // 或使用 time()
    $ftime = $this->getTypeFtime($gameId);         // 封单时间
    $actionTime = $this->getGameActionTime($gameId); // 当期时间
    $actionNo = $this->getGameActionNo($gameId);     // 当期期数

    // 检查当前时间是否已经超过封单时间
    if ($currentTime > ($actionTime - $ftime)) {
        $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
        echo json_encode($betinfo); 
        exit;
    }

    // 检查投注期数是否正确
    if ($actionNo != $turnNum) {  
        $betinfo['msg'] = '投注失敗2：你投注第' . $actionNo . '已過購買時間';	
        echo json_encode($betinfo); 
        exit;
    }

    // 额外检查，确保投注时间仍然有效
    if (($actionTime - $ftime) < $currentTime) {  
        $betinfo['msg'] = '投注失敗3：你投注第' . $turnNum . '已過購買時間';	
        echo json_encode($betinfo); 
        exit;
    }

    // 检查投注金额和注数等其他逻辑
    // ... 保持不变 ...

    // 检查提交资料的时间是否有效，基于服务器时间
    // 之前的代码: elseif($postftime < $this->time){
    // 修改为基于服务器时间，不需要这个检查，因为已经在上面进行了验证

    // 检查游戏是否启用
    $gameenable = $this->getValue("select enable from {$this->prename}type where id={$gameId}");
    if($gameenable != 1){  
        $betinfo['msg'] = '遊戲已停用,請刷新再投';	
        echo json_encode($betinfo); 
        exit;
    } 

    // 查询用户可用资金
    $userAmount = $this->getValue("select coin from {$this->prename}members where uid={$this->user['uid']}");
    if($userAmount < $totalMoney){  
        $betinfo['msg'] = '您的可用資金不足，請先儲值';	
        echo json_encode($betinfo); 
        exit;
    } 

    // 检查注数
    if($totalNums < 1){  
        $betinfo['msg'] = '注數不能小於1，請重新投注';	
        echo json_encode($betinfo); 
        exit;
    }
    
    if($totalNums > 1000){  
        $betinfo['msg'] = '注數不能大於1000，請重新投注';	
        echo json_encode($betinfo); 
        exit;
    }
    
    if($totalMoney < 1){
        $betinfo['msg'] = '投注總金額不能小於1，請重新投注';	
        echo json_encode($betinfo); 
        exit;
    }

    // 查询当前期数已投注总额
    $actionNoMoney = $this->getValue("select sum(money * totalNums) from {$this->prename}bets where uid={$this->user['uid']} and type={$gameId} and actionNo={$actionNo}");
    
    // 查询用户单期投注总额限制		
    $usermaxTurnMoney = $this->getValue("select maxTurnMoney from {$this->prename}members where uid={$this->user['uid']}");
    if(($actionNoMoney + $totalMoney) > $usermaxTurnMoney && $usermaxTurnMoney){  
        $betinfo['msg'] = '您的單期投注金額只能小於' . $usermaxTurnMoney . ',現已投注' . $actionNoMoney;	
        echo json_encode($betinfo); 
        exit;
    } 

    // 检查每注的赔率和其他条件
    $this->getPlayeds2();
    foreach($betBean as $code){
        // 基于服务器时间重新获取封单时间和当期时间
        $ftime2 = $this->getTypeFtime($gameId);          // 封单时间2
        $actionTime2 = $this->getGameActionTime($gameId); // 当期时间2
        $actionNo2 = $this->getGameActionNo($gameId);     // 当期期数2

        // 检查当前服务器时间是否已经超过封单时间
        if ($currentTime > ($actionTime2 - $ftime2)) {  
            $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
            echo json_encode($betinfo); 
            exit;
        }

        // 检查投注期数是否正确
        if ($actionNo2 != $turnNum) {  
            $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
            echo json_encode($betinfo); 
            exit;
        }

        // 额外检查，确保投注时间仍然有效
        if (($actionTime2 - $ftime2) < $currentTime) {  
            $betinfo['msg'] = '投注失敗：你投注第' . $turnNum . '已過購買時間';	
            echo json_encode($betinfo); 
            exit;
        }

        // 检查玩法是否启用
        $played = $this->playeds2[$code['playId']];
        if(!$played['enable']){  
            $betinfo['msg'] = '遊戲玩法已停用,請刷新再投' . $code['playId'];	
            echo json_encode($betinfo); 
            exit;
        }
        
        // 检查玩法ID是否正确
        if($played['id'] != intval($code['playId'])){  
            $betinfo['msg'] = '提交資料出錯，請重新投注';	
            echo json_encode($betinfo); 
            exit;
        }
        
        // 查询当前期数每个玩法已投注总额
        $code['playId'] = intval($code['playId']);
        $playsql = "select sum(money * totalNums) from {$this->prename}bets where uid={$this->user['uid']} and type={$gameId} and actionNo={$actionNo} and playedId={$code['playId']}";
        $playMoney = $this->getValue($playsql);
        
        // 查询玩法设置中的每期每个玩法的投注总额限制
        $maxcount = $this->getmaxcount($code['playId']);
        if(($playMoney + intval($code['money'])) > $maxcount['maxTurnMoney']){ 
            $playeds = $this->playeds[$code['playId']];
            $playedGroup = $this->playedGroup[$playeds['played_groupid']];
            $betinfo['msg'] = '遊戲玩法（' . $playedGroup['name'] . '-' . $playeds['name'] . '）每期金額只能小於' . $maxcount['maxTurnMoney'] . ',現已投注' . $playMoney;
            echo json_encode($betinfo); 
            exit;
        }
        
        // 查询用户单注投注金额限制
        $usermaxMoney = $this->getValue("select maxMoney from {$this->prename}members where uid={$this->user['uid']}");
        if($usermaxMoney < intval($code['money']) && $usermaxMoney){  
            $betinfo['msg'] = '您的單注金額只能小於' . $usermaxMoney;	
            echo json_encode($betinfo); 
            exit;
        } 
        
        // 检查单注最低金额
        if(floatval($code['money']) < $maxcount['minMoney']){  
            $betinfo['msg'] = '單注金額只能大於' . $maxcount['minMoney'] . '正整數';	
            echo json_encode($betinfo); 
            exit;
        }
    
        // 检查单注最高金额
        if(floatval($code['money']) > $maxcount['maxMoney']){  
            $betinfo['msg'] = '單注金額只能為小於' . $maxcount['maxMoney'] . '正整數';	
            echo json_encode($betinfo); 
            exit;
        }
    }		
    
    // 开始事务处理
    $this->beginTransaction();
    try{
        $randorderid = mt_rand(10000,99999);
        if(isset($turnNum)) unset($turnNum);
        // if(isset($postftime)) unset($postftime); // 已移除

        foreach($betBean as $code){
            // 插入投注表
            $code['wjorderId'] = date('YmdHis', $currentTime) . strval($this->createRandomStr(10));
            $code['orderId'] = strval(date('YmdHis', $currentTime)) . $randorderid;
            $code['money'] = floatval($code['money']);
            $amount = abs($code['money']);
            $played = $this->playeds2[$code['playId']];
            $playedGroup = $this->playedGroup[$played['played_groupid']];
            $userrebate = ($this->user['rebate'] > 0) ? $this->user['rebate'] : $played['rebate'];

            $para = array(
                'wjorderId' => $code['wjorderId'],
                'orderId' => $code['orderId'],
                'serializeId' => uniqid(),
                'uid' => $this->user['uid'],
                'username' => $this->user['username'],
                'nickname' => $this->user['nickname'],
                'type' => $gameId,
                'playedGroup' => $played['played_groupid'],
                'playedId' => $played['id'],
                'Groupname' => $playedGroup['name'],
                //'playedname'=>$playeds['name'],
                'odds' => $played['odds'],
                'actionNo' => $actionNo,
                'actionTime' => $currentTime,
                'actionIP' => $this->ip(true),
                'actionData' => $played['name'],
                'rebate' => $userrebate,
                'money' => $code['money'],
                'kjTime' => $actionTime
            );
                
            // 判断是否复选
            if($code['betInfo']){
                $para['betInfo'] = $code['betInfo'];
                if($playedGroup['name'] != '連肖連尾'){
                    $para['totalMoney'] = $totalMoney;
                    $para['totalNums'] = $totalNums;
                    $amount = $totalMoney;
                }
            }
            $this->insertRow($this->prename .'bets', $para);

            // 添加用户资金流动日志
            $this->addCoin(array(
                'uid' => $this->user['uid'],
                'type' => $gameId,
                'playedId' => $para['playedId'],
                'liqType' => $liqType,
                'info' => $info,
                'extfield0' => $this->lastInsertId(),
                'extfield1' => $para['serializeId'],
                //'extfield2'=>$data['orderId'],
                'coin' => -$amount,
                //'fcoin'=>$amount
            ));
        }
        $this->commit();
        $betinfo['success'] = true;
        $betinfo['msg'] = '投注成功';
        echo json_encode($betinfo); 
    } catch(Exception $e){
        $this->rollBack();
        $betinfo['success'] = false;
        $betinfo['msg'] = '異常錯誤:'.$e->getMessage().'請聯絡管理員';	
        echo json_encode($betinfo); 
        exit;
    }
}
	/**
	 * {{{ ajax撤单
	 */
	public final function deleteCode($id){
		$id=intval($_GET['id']);
		$this->beginTransaction();
		try{
            if($this->user['testFlag']==1){
    			$sql="select * from {$this->prename}guestbets where id=?";
    			// print_r($id);exit;
    			if(!$data=$this->getRow($sql, $id)) {echo "<script>alert('找不到定單。');window.history.back();</script>";exit;}
    			if($data['isDelete']) {echo "<script>alert('這單子已經撤單過了。');window.history.back();</script>";exit;}
    			if($data['uid']!=$this->user['uid']) {echo "<script>alert('這單子不是您的，您不能撤單。');window.history.back();</script>";exit;}
    			if($data['kjTime']<=$this->time) {echo "<script>alert('已經開獎，不能撤單');window.history.back();</script>";exit;}
    			if($data['lotteryNo']) {echo "<script>alert('已經開獎，不能撤單');window.history.back();</script>";exit;}
    
    			// 冻结时间后不能撤单
    			$this->getTypes();
    			$ftime=$this->getTypeFtime($data['type']);
    			if($data['kjTime']-$ftime<$this->time) {echo "<script>alert('這期已經結凍，不能撤單');window.history.back();</script>";exit;}
    
    			$amount=$data['money'];
    			$amount=abs($amount);
    			
    			// 添加用户资金变更日志
				$this->guestaddCoin(array(
    				'uid'=>$data['uid'],
    				'type'=>$data['type'],
    				'playedId'=>$data['playedId'],
    				'liqType'=>7,
    				'info'=>"撤单",
    				'extfield0'=>$id,
    				'coin'=>$amount,
					//'fcoin'=>$amount
				));
    
    			// 更改定单为已经删除状态
    			$sql="update {$this->prename}guestbets set isDelete=1 where id=?";
    			$this->update($sql, $id);
    			
    			$this->commit();
            }else{
    			// throw new Exception('不能撤单');
    			// echo "<script>alert('注册成功');</script>";
    			// exit;
    			$sql="select * from {$this->prename}bets where id=?";
    			// print_r($id);exit;
    			if(!$data=$this->getRow($sql, $id)) {echo "<script>alert('找不到定單。');window.history.back();</script>";exit;}
    			if($data['isDelete']) {echo "<script>alert('這單子已經撤單過了。');window.history.back();</script>";exit;}
    			if($data['uid']!=$this->user['uid']) {echo "<script>alert('這單子不是您的，您不能撤單。');window.history.back();</script>";exit;}
    			if($data['kjTime']<=$this->time) {echo "<script>alert('已經開獎，不能撤單');window.history.back();</script>";exit;}
    			if($data['lotteryNo']) {echo "<script>alert('已經開獎，不能撤單');window.history.back();</script>";exit;}
    
    			// 冻结时间后不能撤单
    			$this->getTypes();
    			$ftime=$this->getTypeFtime($data['type']);
    			if($data['kjTime']-$ftime<$this->time) {echo "<script>alert('這期已經結凍，不能撤單');window.history.back();</script>";exit;}
    
    			$amount=$data['money'];
    			$amount=abs($amount);
    			
    			// 添加用户资金变更日志
    			$this->addCoin(array(
    				'uid'=>$data['uid'],
    				'type'=>$data['type'],
    				'playedId'=>$data['playedId'],
    				'liqType'=>7,
    				'info'=>"撤单",
    				'extfield0'=>$id,
    				'coin'=>$amount,
    				//'fcoin'=>-$amount
    			));
    
    			// 更改定单为已经删除状态
    			$sql="update {$this->prename}bets set isDelete=1 where id=?";
    			$this->update($sql, $id);
    			
    			$this->commit();
            }
			echo "<script>alert('撤單成功');window.history.back();</script>";exit;
		}catch(Exception $e){
			$this->rollBack();
			throw $e;
		}
	}
	
	public final function guestpostcode(){
		//header('content-Type: text/html;charset=utf-8');		
		$betBean=$_POST['betBean'];	
		$gameId=intval($_POST['gameId']);
		$turnNum=$_POST['turnNum'];
		$postftime=$_POST['ftime'];
		$totalNums=intval($_POST['totalNums']);	
		$totalMoney=intval($_POST['totalMoney']);				
		$betinfo=array();
		$betinfo['success']=false;
		$betinfo['msg']='';
		$betinfo['code']=0;


		$liqType=101;
		$info='投注';
		$this->getSystemSettings();
		$this->freshSession();
		if(intval($this->settings['switchBuy'])==0){
			$betinfo['msg']='本平台已停止購買！';	
			echo json_encode($betinfo);
			exit;
		}elseif(intval($this->settings['switchDLBuy'])==0 && $this->user['type']==1){
			$betinfo['msg']='代理不能投注！';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('代理不能买单！');
		}elseif(intval($this->settings['switchZDLBuy'])==0 &&  $this->user['type']==2){
			$betinfo['msg']='總代理不能投注！';	
			echo json_encode($betinfo); 
			exit;
		}elseif(intval($this->settings['switchGDBuy'])==0 &&  $this->user['type']==3){
			$betinfo['msg']='股東不能投注！';	
			echo json_encode($betinfo); 
			exit;
		}elseif(count($betBean)==0){
			$betinfo['msg']='請先選擇號碼再提交投注';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('请先选择号码再提交投注');
			
		}elseif($postftime < $this->time){
			$betinfo['msg']='提交資料出錯,請刷新再投';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('提交数据出错,请刷新再投');
		}
		
		$gameenable=$this->getValue("select enable from {$this->prename}type where id={$gameId}");
		if($gameenable !=1){  
			$betinfo['msg']='遊戲已停用,請刷新再投';	
			echo json_encode($betinfo); 
			exit;
		} 
		
		// 查询用户可用资金
		$userAmount=$this->getValue("select coin from {$this->prename}guestmembers where uid={$this->user['uid']}");
		if($userAmount < $totalMoney){  
			$betinfo['msg']='您的可用資金不足，請先儲值';	//throw new Exception('您的可用资金不足，是否充值？');
			echo json_encode($betinfo); 
			exit;
		} 

		//检查时间 期数
		$ftime=$this->getTypeFtime($gameId);  //封单时间
		$actionTime=$this->getGameActionTime($gameId);  //当期时间
		$actionNo=$this->getGameActionNo($gameId);  //当期期数
		if($actionTime-$ftime != $postftime){
			$betinfo['msg']='投注失敗1：你投注第'.$turnNum.'已過購買時間';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('投注失败：你投注第'.$turnNum.'已过购买时间');
		}
		if($actionNo != $turnNum){  
			$betinfo['msg']='投注失敗2：你投注第'.$actionNo.'已過購買時間';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('投注失败：你投注第'.$turnNum.'已过购买时间');
		}
		if($actionTime-$ftime < $this->time){  
			$betinfo['msg']='投注失敗3：你投注第'.$turnNum.'已過購買時間';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('投注失败：你投注第'.$turnNum.'已过购买时间');
		} 
		// 检查注数
		if($totalNums<1){  
			$betinfo['msg']='注數不能小於1，請重新投注';	
			echo json_encode($betinfo); 
			exit;
			//throw new Exception('注数不能小于1，请重新投注');
		}
		
		if($totalNums > 1000){  
			$betinfo['msg']='注數不能大於1000，請重新投注';	//此处用于限制复选非正常投注及跳过POST数据限制
			echo json_encode($betinfo); 
			exit;
		}
		
		if($totalMoney<1){
			$betinfo['msg']='投注總金額不能小於1，請重新投注';	//此处用于限制复选非正常投注及跳过POST数据限制
			echo json_encode($betinfo); 
			exit;
		}
		
		//查询当前期数已投注总额
		$actionNoMoney=$this->getValue("select sum(money * totalNums) from {$this->prename}guestbets where uid={$this->user['uid']} and type={$gameId} and actionNo={$actionNo}");
		//查询用户单期投注总额限制		
		$usermaxTurnMoney=$this->getValue("select maxTurnMoney from {$this->prename}guestmembers where uid={$this->user['uid']}");
		if(($actionNoMoney +$totalMoney) > $usermaxTurnMoney && $usermaxTurnMoney){  
			$betinfo['msg']='您的單期投注金額只能小於'.$usermaxTurnMoney.',現已投注'.$actionNoMoney;	
			echo json_encode($betinfo); 
			exit;
		} 
		
		//$money2=0;
		// 查检每注的赔率是否正常
		$this->getPlayeds();
		foreach($betBean as $code){
			//检查时间 期数2
		    $ftime2=$this->getTypeFtime($gameId);  //封单时间2
		    $actionTime2=$this->getGameActionTime($gameId);  //当期时间2
		    $actionNo2=$this->getGameActionNo($gameId);  //当期期数2
            if($actionTime2-$ftime2 != $postftime){  
			$betinfo['msg']='投注失敗：你投注第'.$turnNum.'已過購買時間';	
			echo json_encode($betinfo); 
			exit;
			}
		    if($actionNo2 != $turnNum){  
			$betinfo['msg']='投注失敗：你投注第'.$turnNum.'已過購買時間';	
			echo json_encode($betinfo); 
			exit;
			}
		    if($actionTime-$ftime2 < $this->time){  
			$betinfo['msg']='投注失敗：你投注第'.$turnNum.'已過購買時間';	
			echo json_encode($betinfo); 
			exit;
			}
			
			//检查开启
			$played=$this->playeds[$code['playId']];
			if(!$played['enable']){  
			$betinfo['msg']='遊戲玩法已停用,請刷新再投'.$code['playId'];	//throw new Exception('游戏玩法组已停,请刷新再投');
			echo json_encode($betinfo); 
			exit;
			}
			
            //检查ID
			if($played['id'] != intval($code['playId'])){  
			$betinfo['msg']='提交資料出錯，請重新投注';	//throw new Exception('提交数据出错，请重新投注');
			echo json_encode($betinfo); 
			exit;
			}
			
			//查询当前期数每个玩法已投注总额
			$code['playId']=intval($code['playId']);
			$playsql="select sum(money * totalNums) from {$this->prename}guestbets where uid={$this->user['uid']} and type={$gameId} and actionNo={$actionNo} and playedId={$code['playId']}";
			$playMoney=$this->getValue($playsql);
			//查询玩法设置中的每期每个玩法的投注总额限制
			$maxcount=$this->getmaxcount($code['playId']);
			if(($playMoney +intval($code['money'])) > $maxcount['maxTurnMoney']){ 
				$playeds=$this->playeds[$code['playId']];
				$playedGroup=$this->playedGroup[$playeds['played_groupid']];
				$betinfo['msg']='遊戲玩法（'.$playedGroup['name'].'-'.$playeds['name'].'）每期金額只能小於'.$maxcount['maxTurnMoney'].',現已投注'.$playMoney;
				echo json_encode($betinfo); 
				exit;
			}
			
			$usermaxMoney=$this->getValue("select maxMoney from {$this->prename}guestmembers where uid={$this->user['uid']}");
			if($usermaxMoney < intval($code['money']) && $usermaxMoney){  
				$betinfo['msg']='您的單注金額只能小於'.$usermaxMoney;	
				echo json_encode($betinfo); 
				exit;
			} 
			
			if(floatval($code['money'])<$maxcount['minMoney']){  
			$betinfo['msg']='單注金額只能大於'.$maxcount['minMoney'].'正整數';	//throw new Exception('金额只能为大于1正整数');
			echo json_encode($betinfo); 
			exit;
			}
		
			//单注最高检查
			if(floatval($code['money']) > $maxcount['maxMoney']){  
				$betinfo['msg']='單注金額只能為小於'.$maxcount['maxMoney'].'正整數';	//throw new Exception('金额只能为大于1正整数');
				echo json_encode($betinfo); 
				exit;
			}
		
			//$money2 +=intval($code['money']);
		}		
		
		// 开始事物处理
		$this->beginTransaction();
		try{
			$randorderid=mt_rand(10000,99999);
			if(isset($turnNum)) unset($turnNum);
			if(isset($postftime)) unset($postftime);
			foreach($betBean as $code){
				// 插入投注表
				$code['wjorderId']=date('YmdHis',$this->time).strval($this->createRandomStr(10));
				$code['orderId']=strval(date('YmdHis',$this->time)).$randorderid;
				$code['money']=floatval($code['money']);
				$amount=abs($code['money']);
				$sql=$code['wjorderId'].', ';
				$playeds=$this->playeds[$code['playId']];
				$playedGroup=$this->playedGroup[$playeds['played_groupid']];
				if($this->user['rebate']>0){
					$userrebate=$this->user['rebate'];
				}else{
					$userrebate=$playeds['rebate'];
				}
					$para=array(
					'wjorderId'=>$code['wjorderId'],
					'orderId'=>$code['orderId'],
					'serializeId'=>uniqid(),
					'uid'=>$this->user['uid'],
					'username'=>$this->user['username'],
					'nickname'=>$this->user['nickname'],
					'type'=>$gameId,
					'playedGroup'=>$playeds['played_groupid'],
					'playedId'=>$playeds['id'],
					'Groupname'=>$playedGroup['name'],
					//'playedname'=>$playeds['name'],
					'odds'=>$playeds['odds'],
					'actionNo'=>$actionNo,
					'actionTime'=>$this->time,
					'actionIP'=>$this->ip(true),
					'actionData' => $playeds['name'],
					'rebate' => $userrebate,
					'money' => $code['money'],
					'kjTime'=>$actionTime
					);
					
				//判断是否复选
				if($code['betInfo']){
					$para['betInfo']=$code['betInfo'];
					if($playedGroup['name'] != '連肖連尾'){
					$para['totalMoney']=$totalMoney;
					$para['totalNums']=$totalNums;
					$amount=$totalMoney;
					}
				}
				$this->insertRow($this->prename .'guestbets', $para);
	
				// 添加用户资金流动日志
				$this->guestaddCoin(array(
					'uid'=>$this->user['uid'],
					'type'=>$gameId,
					'playedId'=>$para['playedId'],
					'liqType'=>$liqType,
					'info'=>$info,
					'extfield0'=>$this->lastInsertId(),
					'extfield1'=>$para['serializeId'],
					//'extfield2'=>$data['orderId'],
					'coin'=>-$amount,
					//'fcoin'=>$amount
				));
			}
			$this->commit();
			$betinfo['success']=true;
			$betinfo['msg']='投注成功';	//throw new Exception('您的可用资金不足，是否充值？');
			echo json_encode($betinfo); 
		}catch(Exception $e){
			$this->rollBack();
			$betinfo['success']=false;
			$betinfo['msg']='異常錯誤:'.$e.'請聯絡管理員';	//throw new Exception('您的可用资金不足，是否充值？');
			echo json_encode($betinfo); 
			exit;
			//throw $e;
		}
	}
}
