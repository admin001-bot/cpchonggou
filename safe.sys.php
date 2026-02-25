<?php  
//Code By Safe3  
function customError($errno, $errstr, $errfile, $errline)  
{  
  echo "<b>Error number:</b> [$errno],error on line $errline in $errfile<br />" ;  
  die();  
}  
set_error_handler("customError",E_ERROR);  
$getfilter="'|(and|or)\\b.+?(>|<|=|in|like)|\\/\\*.+?\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?Select|Update.+?SET|Insert\\s+INTO.+?VALUES|(Select|Delete).+?FROM|(Create|Alter|Drop|TRUNCATE)\\s+(TABLE|DATABASE)" ;  
$postfilter="\\b(and|or)\\b.{1,6}?(=|>|<|\\bin\\b|\\blike\\b)|\\/\\*.+?\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?Select|Update.+?SET|Insert\\s+INTO.+?VALUES|(Select|Delete).+?FROM|(Create|Alter|Drop|TRUNCATE)\\s+(TABLE|DATABASE)" ;  
$cookiefilter="\\b(and|or)\\b.{1,6}?(=|>|<|\\bin\\b|\\blike\\b)|\\/\\*.+?\\*\\/|<\\s*script\\b|\\bEXEC\\b|UNION.+?Select|Update.+?SET|Insert\\s+INTO.+?VALUES|(Select|Delete).+?FROM|(Create|Alter|Drop|TRUNCATE)\\s+(TABLE|DATABASE)" ;  
function StopAttack($StrFiltKey,$StrFiltValue,$ArrFiltReq){  
   
if(is_array($StrFiltValue))  
{  
  $StrFiltValue=implode($StrFiltValue);  
}  
if (preg_match("/".$ArrFiltReq."/is",$StrFiltValue)==1){  
    echo("<br><br>操作IP: ".$_SERVER["REMOTE_ADDR"]."<br>操作時間: ".strftime("%Y-%m-%d %H:%M:%S")."<br>操作頁面:".$_SERVER["PHP_SELF"]."<br>提交方式: ".$_SERVER["REQUEST_METHOD"]."<br>提交參數: ".$StrFiltKey."<br>提交數據: ".$StrFiltValue);  
    exit();  
}    
}  
//$ArrPGC=array_merge($_GET,$_POST,$_COOKIE);  
foreach($_GET as $key=>$value){  
  StopAttack($key,$value,$getfilter);  
}  
foreach($_POST as $key=>$value){  
  StopAttack($key,$value,$postfilter);  
}  
foreach($_COOKIE as $key=>$value){  
  StopAttack($key,$value,$cookiefilter);  
}  
/*
if (file_exists('update360.php')) {  
  echo "请重命名文件update360.php，防止黑客利用<br/>";  
  die();  
} 
*/
function slog($logs)  
{  
  $toppath=$_SERVER["DOCUMENT_ROOT"]."/log.htm";  
  $Ts=fopen($toppath,"a+");  
  fputs($Ts,$logs."\r\n");  
  fclose($Ts);  
}  