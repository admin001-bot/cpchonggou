<?php
session_start();
include('ApiBi/BiApi.class.php');
$platformCode=strtoupper($_GET['game']);
$gameType=$_GET['gameType'];
$user=unserialize($_SESSION['member-session-name']);

$username=$user['username'];

$api=new Biapi();

if($_GET['sysyue']){
	$sysyue=$api->balances($platformCode,$username,$gameType,'','');	
	die(($sysyue));
	die;
}

if(!$username){
		echo "<script>alert('請先登入');history.back(-1);window.close();</script>";
		exit();
}
if($user['testFlag']==1){
		echo "<script>alert('請註冊正式帳戶');history.back(-1);window.close();</script>";
		exit();
}

if(($gameType)){
	$url=$api->loginbi($platformCode,$username,$gameType);
}else{
	$url=$api->loginbi($platformCode,$username);
}

//var_dump($url);die;

header("Location:$url");
die;

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>    
        <title>真人娛樂</title>
     <script type="text/javascript" src="../js/jquery-1.7.2.min.js"></script>
	     </head>
    <frameset rows="*" cols="100%">
        <frame noresize="noresize" src="" scrolling="auto" name="top">
        <noframes>
        </noframes>
    </frameset>

</html>
<script>
	window.location.href="<?=$url?>";
</script>
