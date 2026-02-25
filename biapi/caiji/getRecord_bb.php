<?php
include_once("Biapi.class.php");
header('Content-Type:text/html; charset=utf-8');
include ("../mysqli.php");
function SaveTime($jsonDate){
preg_match('/\d{10}/',$jsonDate,$matches);
return (date('Y-m-d H:i:s',$matches[0]));
}
$time=time();
$S_time=$time-360*60;
$E_time=$time;
$limit=100;
$PageIndex=0;
$platformCode='BB';
$BB=new Biapi();
$data_bb=$BB->GetMerchantReport($platformCode,$S_time,$E_time,$time,$PageIndex,$limit);

$count=0;
foreach($data_bb['data'] as $k=>$v){
    $orderid=$v['WagersID'];
    $sql="select * from bb_bet where WagersID='$orderid'";
    $result = $mysqli->query($sql);
    $tcou	= $mysqli->affected_rows;
    if($tcou==0){
        $v['WagersDate']=SaveTime($v['WagersDate']);
        $sql = "insert into bb_bet(boingId,UserName,WagersID,WagersDate,SerialID,RoundNo,GanmeType,WagerDetail,GameCode,Result,Card,BetAmount,Origin,Commissionable,Payoff,Currency,ExchangeRate,ResultType) values ('".$v['ID']."','".$v['UserName']."','".$v['WagersID']."','".$v['WagersDate']."','".$v['SerialID']."','".$v['RoundNo']."','".$v['GanmeType']."','".$v['WagerDetail']."','".$v['GameCode']."','".$v['Result']."','".$v['Card']."','".$v['BetAmount']."','".$v['Origin']."','".$v['Commissionable']."','".$v['Payoff']."','".$v['Currency']."','".$v['ExchangeRate']."','".$v['ResultType']."')";
		//echo $sql;die();
        $insert=$mysqli->query($sql);
        if($insert==true){
            $count+=1;
		$sql_liveorder="insert into live_order (live_username,order_num,order_time,live_th,live_type,live_office,office_num,live_result,bet_info,bet_money,live_win,ip,live_status,game_room,game_type,VALIDBETAMOUNT) value('".$v['UserName']."','".$v['WagersID']."','".$v['WagersDate']."','".$v['GameCode']."','BB','".$v['SerialID']."','','".$v['ResultType']."','','".$v['BetAmount']."','".$v['Payoff']."','','','','BB','".$v['Commissionable']."');";
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
            BB:成功采集到<?=$count?>条数据
      <span id="timeinfo"></span>
      </td>
  </tr>
</table>
</body>
</html>
