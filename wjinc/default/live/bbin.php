<?php 
function curl_file_get_contents($durl){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $durl);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$r = curl_exec($ch);
	curl_close($ch);
	return $r;
}
?>
<?php 
header("Content-type: text/html; charset=utf-8");
session_start();
$uid = intval(@$this->user['uid']);
$username = @$this->user['username'];
include_once("live/config.php");
if(!$username){
	echo "<script>alert('請登入後再試！');window.close();</script>";exit;
}
if(!$isBB){
	echo "<script>alert('未開通BB!');window.close();</script>";exit;
}

$sign = md5($plantform."_".$merID."_".$key."_".$username);

$page_site = $_REQUEST["site"];
if(!$page_site){
	$page_site = "live";
}


$pUrl = "bbinUrl";
$pUrl = "bbinUrl";
$pTime = "urltime";
//echo $pUrl."".$pTime;exit;
if(@$_SESSION[$pUrl] != null && @$_SESSION[$pTime] > (time() - 60)){
	if(@$_SESSION['bbinType'] != $page_site){
		echo "<script>alert('您的登陸過於頻繁，請1分鐘後在試！！');window.close();</script>";exit;
	}else{
		$url = $_SESSION[$pUrl];
		$_SESSION[$pTime]=time();
	}
}else{
	$url = $fenjieHost."/bb!login.do?plantform=".$plantform."&username=".$username."&password=".$password."&page_site=".$page_site."&sign=".$sign;
	$url = curl_file_get_contents($url);
	if(strpos($url, "alert") > 0){
		echo "<script>alert('您的登陸過於頻繁，請1分鐘後在試！');window.close();</script>";exit;
	}else{
		$_SESSION[$pTime]=time();
		$_SESSION[$pUrl]=$url;
		$_SESSION['bbinType']=$page_site;
	}
}
echo $url;
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<title><?= $this->settings['webName'] ?>-AG真人視訊直播</title>
</head>
	<frameset rows="*" cols="100%">
	<frame noresize="noresize" src="<?=$url ?>">
	<noframes>
	</noframes>
	</frameset>
</html>