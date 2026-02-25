<?php
include_once("Biapi.class.php");
header('Content-Type:text/html; charset=utf-8');
include ("../mysqli.php");
function SaveTime($jsonDate){
preg_match('/\d{10}/',$jsonDate,$matches);
return (date('Y-m-d H:i:s',$matches[0]));
}
$time=time();
$S_time=$time-24*60*60;
$E_time=$time;
$limit=100;
$PageIndex=0;
$platformCode='CG';
// var_dump($S_time);
// exit;
$CG=new Biapi();
$data_cg=$CG->GetMerchantReport($platformCode,$S_time,$E_time,$time,$PageIndex,$limit);
// var_dump($data_cg);
// die();
$count=count($data_cg['data']);
foreach($data_cg['data'] as $k=>$v){
    $orderid=$v['id'];
    $sql="select * from cg_bet where cgid='$orderid'";
    $result = $mysqli->query($sql);
    $tcou	= $mysqli->affected_rows;
    if($tcou==0){
        //$v['transTime']=SaveTime($v['transTime']);
		$v['GameDate']=SaveTime($v['GameDate']);
        $sql = "insert into cg_bet(cgid,userName,currency,gameType,tableInfoId,shoeInfoId,gameInfoId,tableName,issueNo,bankerResult,stakeAmount,validStake,winLoss,comm,balanceAfter,endTime,ip,resultImgName,tips,betType,betAmount,winLossAmount,betTime,GameDate) 
		values ('".$v['id']."','".$v['userName']."','".$v['currency']."','".$v['gameType']."','".$v['tableInfoId']."','".$v['shoeInfoId']."','".$v['gameInfoId']."','".$v['tableName']."','".$v['issueNo']."','".$v['bankerResult']."','".$v['stakeAmount']."','".$v['validStake']."','".$v['winLoss']."','".$v['comm']."','".$v['balanceAfter']."','".$v['endTime']."','".$v['ip']."','".$v['resultImgName']."','".$v['tips']."','".$v['betType']."','".$v['betAmount']."','".$v['winLossAmount']."','".$v['betTime']."','".$v['GameDate']."')";
		
        $insert=$mysqli->query($sql);
        if($insert==true){
            $count+=1;
		$sql_liveorder="insert into live_order (live_username,order_num,order_time,live_th,live_type,live_office,office_num,live_result,bet_info,bet_money,live_win,ip,live_status,game_room,game_type,VALIDBETAMOUNT) 
		value('".$v['userName']."','".$v['id']."','".$v['GameDate']."','".$v['tableInfoId']."','CG','','','".$v['bankerResult']."','','".$v['stakeAmount']."','".$v['winLossAmount']."','".$v['ip']."','','','CG','".$v['stakeAmount']."');";
		// echo $sql_liveorder;die();
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
            CG:成功采集到<?=$count?>条数据
      <span id="timeinfo"></span>
      </td>
  </tr>
</table>
</body>
</html>
