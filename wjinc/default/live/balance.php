<?php 
include_once('biapi/ApiBi/BiApi.class.php');
ini_set("display_errors", "On");

error_reporting(E_ALL | E_STRICT);
header("Content-type: text/html; charset=utf-8");
$target = strtoupper($_REQUEST['target']);
if(strlen($target) != 2){
	echo "0.00";exit;
}
$uid = intval(@$this->user['uid']);
$username = @$this->user['username'];
if(!$username){
	echo "<script>alert('請登入後再試！');window.close();</script>";exit;
}
$api=new Biapi();
$res=$api->balances($target,$username,'','','');	
echo $res;
?>