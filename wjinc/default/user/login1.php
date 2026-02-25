<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title><?=$this->iff($args[0], $args[0] . '－'). $this->settings['webName']?></title>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<meta http-equiv="cleartype" content="on">
<meta name="apple-mobile-web-app-status-bar-style" content="yes" />
<script type="text/javascript" src="/skin/js/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="/skin/main/onload.js?version=20160420"></script>
<script type="text/javascript" src="/skin/main/reglogin.js"></script>
<script type="text/javascript" src="/js/guest.js"></script>
<style type="text/css">
body {
    /*background-color: #619CC7;*/
    background: url('/images/bg3.jpg') no-repeat;
    background-size: 115% auto;
    opacity:0.8;
}
.container {
    text-align: center;
}
input::-ms-input-placeholder{padding-left: 10px;}
input::-webkit-input-placeholder{padding-left: 10px;}
.logo {
    margin-top: 30px;
}
.toptextfield {
    margin-top: 30px;
}
.btmtextfield {
    margin-top: 0px;
}
.capchatextfield {
    margin-top: 15px;
    position: relative;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
}
.cn {
    font-family: Tahoma, Helvetica, Arial, "Microsoft Yahei","微软雅黑", STXihei, "华文细黑", sans-serif;
    font-size: 16px;
    color: #000;
}
.textfieldtop {
    width: 100%;
    height: 50px;
    padding:0;
    border: 1px solid #e7e7e7;
    -webkit-border-top-left-radius: 12px;
    -webkit-border-top-right-radius: 12px;
    -moz-border-radius-topleft: 12px;
    -moz-border-radius-topright: 12px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: none;
}
.textfieldbtm {
    width: 100%;
    height: 50px;
    padding: 0;
    border: 1px solid #e7e7e7;
    -webkit-border-bottom-right-radius: 12px;
    -webkit-border-bottom-left-radius: 12px;
    -moz-border-radius-bottomright: 12px;
    -moz-border-radius-bottomleft: 12px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    margin-top: -2px;
}
.textfieldcapcha {
    width: 100%;
    height: 50px;
    padding: 0;
    border: 1px solid #e7e7e7;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
}
.capchaposition {
    position: absolute;
    right: 3px;
    top: 3px;
}
.submitgap {
    margin-top: 30px;
    text-align: center;
}
.registergap {
    margin-top: 20px;
    text-align: center;
}
.registergap a {
    line-height: 52px;
    text-decoration: none;
}
.registergap a:hover, .registergap a:visited {
    color: white;
    text-decoration: none;
}
.submitbtn {
    width: 100%;
    height: 52px;
    font-size: 16px !important;
    background-color: #0772df;
    font-weight: bold;
    text-shadow: 1px 1px #0772df;
    color: #ffffff;
    border-radius: 12px;
    -moz-border-radius: 12px;
    -webkit-border-radius: 12px;
    border: 2px solid #0772df;
    cursor: pointer;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #0772df;
    background: -moz-linear-gradient(top, #0772df 0%, #102a6e 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#0772df), color-stop(100%,#102a6e));
    background: -webkit-linear-gradient(top, #0772df 0%,#102a6e 100%);
    background: -o-linear-gradient(top, #0772df 0%,#102a6e 100%);
    background: -ms-linear-gradient(top, #0772df 0%,#102a6e 100%);
    background: linear-gradient(to bottom, #0772df 0%,#102a6e 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0772df', endColorstr='#102a6e',GradientType=0 );
    padding-top: 0px;
    display: inline-block;
}
.registerbtn {
    width: 45%;
    height: 52px;
    font-size: 16px !important;
    background-color: #4392c3;
    font-weight: bold;
    text-shadow: 1px 1px #4392c3;
    color: #ffffff;
    border-radius: 12px;
    -moz-border-radius: 12px;
    -webkit-border-radius: 12px;
    border: 2px solid #76e8e7;
    cursor: pointer;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #76e8e7;
    background: -moz-linear-gradient(top, #76e8e7 0%, #4392c3 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#76e8e7), color-stop(100%,#4392c3));
    background: -webkit-linear-gradient(top, #76e8e7 0%,#4392c3 100%);
    background: -o-linear-gradient(top, #76e8e7 0%,#4392c3 100%);
    background: -ms-linear-gradient(top, #76e8e7 0%,#4392c3 100%);
    background: linear-gradient(to bottom, #76e8e7 0%,#4392c3 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#76e8e7', endColorstr='#4392c3',GradientType=0 );
    padding-top: 0px;
    display: inline-block;
	float: left;
}
.guestbtn {
    width: 49%;
    height: 52px;
    font-size: 16px !important;
    background-color: #faca68;
    font-weight: bold;
    text-shadow: 1px 1px #faca68;
    color: #ffffff;
    border-radius: 12px;
    -moz-border-radius: 12px;
    -webkit-border-radius: 12px;
    border: 2px solid #faca68;
    cursor: pointer;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #faca68;
    background: -moz-linear-gradient(top, #faca68 0%, #f59831 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fce3bc), color-stop(100%,#f59831));
    background: -webkit-linear-gradient(top, #faca68 0%,#f59831 100%);
    background: -o-linear-gradient(top, #faca68 0%,#f59831 100%);
    background: -ms-linear-gradient(top, #faca68 0%,#f59831 100%);
    background: linear-gradient(to bottom, #faca68 0%,#f59831 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#faca68	', endColorstr='#7f0803',GradientType=0 );
    padding-top: 0px;
    display: inline-block;
	float: right;	
}
</style>
<body>
<div class="container">
<form action="/user/loginedto" method="post" onajax="userBeforeLoginto" enter="true" call="userLoginto" target="ajax" id="loginForm">
    <div class="logo" style="text-align:center"> 
      <img src="/images/logo.png" width="210" height="60" alt=""/> </div>
    <div class="toptextfield">
      <input class="textfieldtop cn" type="text" name="username" id="username" placeholder="用户名">
    </div>
    <div  class="btmtextfield">
      <input class="textfieldbtm cn" name="password" id="password" type="password" placeholder="密码">
    </div>
	<div  class="btmtextfield">
      <label><input id="remember" type="checkbox">記住密碼</label>
    </div>
    <!--<div class="capchatextfield">
      <input type="text" class="textfieldcapcha cn" name="vcode" placeholder="验证码" maxlength="4" pattern="\d*">
      <div class="capchaposition"><img width="90" height="45" alt="验证码" align="absmiddle" src="/user/login/?code=1&<?=$this->time?>" title="看不清楚，点我换图" onclick="this.src='/user/vcode/'+(new Date()).getTime()"/></div>
    </div>-->
    <div class="submitgap">
      <input name="submit" type="submit" class="submitbtn cn" id="submit" value="登录">
    </div>
  </form>
  <div class="registergap"> <a href="/user/register" class="registerbtn cn" id="submit">註冊</a> <a href="javascript:void(0);" onclick="guestLogin();" class="guestbtn cn">免費試玩</a> </div>
  <div class="login_logo">
    <div>
      <div class="gap100"></div>
    </div>
  </div>
</div>
<script>
  window.onload = function(){
    var oForm = document.getElementById('loginForm');
    var oUser = document.getElementById('username');
    var oPswd = document.getElementById('password');
    var oRemember = document.getElementById('remember');
    //页面初始化时，如果帐号密码cookie存在则填充
    if(getCookie('user') && getCookie('pswd')){
      oUser.value = getCookie('user');
      oPswd.value = getCookie('pswd');
      oRemember.checked = true;
    }
    //复选框勾选状态发生改变时，如果未勾选则清除cookie
    oRemember.onchange = function(){
      if(!this.checked){
        delCookie('user');
        delCookie('pswd');
      }
    };
    //表单提交事件触发时，如果复选框是勾选状态则保存cookie
    oForm.onsubmit = function(){
      if(remember.checked){ 
        setCookie('user',oUser.value,7); //保存帐号到cookie，有效期7天
        setCookie('pswd',oPswd.value,7); //保存密码到cookie，有效期7天
      }
    };
  };
  //设置cookie
  function setCookie(name,value,day){
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires='+ date;
  };
  //获取cookie
  function getCookie(name){
    var reg = RegExp(name+'=([^;]+)');
    var arr = document.cookie.match(reg);
    if(arr){
      return arr[1];
    }else{
      return '';
    }
  };
  //删除cookie
  function delCookie(name){
    setCookie(name,null,-1);
  };
</script>
<!--<script src="/layer/layer.js"></script>
<link rel="stylesheet" href="/layer/theme/default/layer.css?v=3.1.1" id="layuicss-layer">
<?php $this->display('head.php');
$sql="select * from {$this->prename}content WHERE `enable` = '1' ORDER BY `id` DESC LIMIT 0, 1";
$content=$this->getRow($sql);
// print_r($content);
?>
<?php 
if($content['content']){
?>
<script>
;!function(){


//页面一打开就执行，放入ready是为了layer所需配件（css、扩展模块）加载完毕
layer.ready(function(){ 
  layer.open({
    type: 2,
    title: '公告',
    maxmin: true,
    area: ['250px', '400px'],
    content: "/user/wzgg",
    end: function(){
      layer.tips('Hi', '#about', {tips: 1})
    }
  });
});



}();
</script>
<?php 
}
?>-->
</body>
</html>