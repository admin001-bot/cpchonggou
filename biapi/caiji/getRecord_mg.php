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
$platformCode='MG';
$MG=new Biapi();
$data_mg=$MG->GetMerchantReport($platformCode,$S_time,$E_time,$time,$PageIndex,$limit);

$count=0;
foreach($data_mg['data'] as $k=>$v){
    $orderid=$v['colId'];
    $sql="select * from mg_bet where colId='$orderid'";
    $result = $mysqli->query($sql);
    $tcou	= $mysqli->affected_rows;
    if($tcou==0){
        //$v['transTime']=SaveTime($v['transTime']);
		$v['BetTime']=SaveTime($v['BetTime']);
        $sql = "insert into mg_bet(boingId,mbrId,mbrCode,gameId,transType,transTime,mgsGameId,mgsActionId,amnt,clrngAmnt,balance,refTransType,BetTime,colId,Win) values ('".$v['ID']."','".$v['mbrId']."','".$v['mbrCode']."','".$v['gameId']."','".$v['transType']."','".$v['transTime']."','".$v['mgsGameId']."','".$v['mgsActionId']."','".$v['amnt']."','".$v['clrngAmnt']."','".$v['balance']."','".$v['refTransType']."','".$v['BetTime']."','".$v['colId']."','".$v['Win']."')";
		//echo $sql;die();
        $insert=$mysqli->query($sql);
        if($insert==true){
            $count+=1;
		$sql_liveorder="insert into live_order (live_username,order_num,order_time,live_th,live_type,live_office,office_num,live_result,bet_info,bet_money,live_win,ip,live_status,game_room,game_type,VALIDBETAMOUNT) 
		value('".$v['mbrCode']."','".$v['colId']."','".$v['BetTime']."','','MG','".$v['mgsGameId']."','','','','".$v['amnt']."','".$v['Win']."','','','','MG','".$v['amnt']."');";
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
            MG:成功采集到<?=$count?>条数据
      <span id="timeinfo"></span>
      </td>
  </tr>
</table>
</body>
</html>
