<?php
include_once("Biapi.class.php");
header('Content-Type:text/html; charset=utf-8');
include ("../mysqli.php");
function SaveTime($jsonDate){
preg_match('/\d{10}/',$jsonDate,$matches);
return (date('Y-m-d H:i:s',$matches[0]));
}
// var_dump($_SERVER['DOCUMENT_ROOT']);
// exit;
$time=time();
$S_time=$time-360*60;
$E_time=$time;
$limit=100;
$PageIndex=0;
$platformCode='AG';
$AG=new Biapi();
$data_AG=$AG->GetMerchantReport($platformCode,$S_time,$E_time,$time,$PageIndex,$limit);

$count=count($data_AG['data']);
foreach($data_AG['data'] as $k=>$v){
    $orderid=$v['betOrderNo'];
    $sql="select * from ag_bet where betOrderNo='$orderid'";
    $result = $mysqli->query($sql);
    $tcou	= $mysqli->affected_rows;
    if($tcou==0){
        $v['transactionTime']=SaveTime($v['transactionTime']);
		$v['betTime']=SaveTime($v['betTime']);
		$v['gameStartTime']=SaveTime($v['gameStartTime']);
		$v['gameEndTime']=SaveTime($v['gameEndTime']);
        $sql = "insert into ag_bet(boingId,username,betAmount,validBetAmount,winAmount,netPnl,currency,transactionTime,gameCode,betOrderNo,betTime,productType,gameCategory,sessionId,jackpotCommission,result,loginIp,deviceType,playType,roomBet,tableCode,gameStartTime,gameEndTime,platformType,room) values ('".$v['ID']."','".$v['username']."','".$v['betAmount']."','".$v['validBetAmount']."','".$v['winAmount']."','".$v['netPnl']."','".$v['currency']."','".$v['transactionTime']."','".$v['gameCode']."','".$v['betOrderNo']."','".$v['betTime']."','".$v['productType']."','".$v['gameCategory']."','".$v['sessionId']."','".$v['jackpotCommission']."','".$v['result']."','".$v['loginIp']."','".$v['deviceType']."','".$v['playType']."','".$v['roomBet']."','".$v['tableCode']."','".$v['gameStartTime']."','".$v['gameEndTime']."','".$v['platformType']."','".$v['room']."')";
		//echo $sql;die();
        $insert=$mysqli->query($sql);
        if($insert==true){
            $count+=1;
		$sql_liveorder="insert into live_order (live_username,order_num,order_time,live_th,live_type,live_office,office_num,live_result,bet_info,bet_money,live_win,ip,live_status,game_room,game_type,VALIDBETAMOUNT) value('".$v['username']."','".$v['betOrderNo']."','".$v['betTime']."','".$v['tableCode']."','AG','','','".$v['result']."','','".$v['betAmount']."','".$v['winAmount']."','".$v['loginIp']."','已结算','".$v['playType']."','AG','".$v['validBetAmount']."');";
		$mysqli->query($sql_liveorder);		
        }
    }
     
}
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title></title>
<style type="text/css">
body,td,th {
    font-size: 12px;
}
body {
    margin-left: 0px;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
}
</style>
</head>
<body>
<script>
var limit="300" 
if (document.images){ 
	var parselimit=limit
} 
function beginrefresh(){ 
if (!document.images) 
	return 
if (parselimit==1) 
	window.location.reload() 
else{ 
	parselimit-=1 
	curmin=Math.floor(parselimit) 
	if (curmin!=0) 
		curtime=curmin+"秒后自动获取!" 
	else 
		curtime=cursec+"秒后自动获取!" 
		timeinfo.innerText=curtime 
		setTimeout("beginrefresh()",1000) 
	} 
} 

window.onload=beginrefresh 
</script>
<table width="100%"border="0" cellpadding="0" cellspacing="0">
  <tr> 
    <td align="left">
      <input type=button name=button value="刷新" onClick="window.location.reload()">
            AG视讯:成功采集到<?=$count?>条数据
      <span id="timeinfo"></span>
      </td>
  </tr>
</table>
</body>
</html>
