<!DOCTYPE html>
<html>
	<head>
		<title>APP下載</title>
		<meta name="keywords" content="" />
		<meta name="description" content="" />
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Content-Language" content="zh-cn">
		<meta content="yes" name="apple-mobile-web-app-capable"/>
		<meta content="yes" name="apple-touch-fullscreen"/>
		<meta content="black" name="apple-mobile-web-app-status-bar-style" />
		<meta content="telephone=no" name="format-detection"/>
		<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no" />
		<meta name="applicable-device" content="pc,mobile">
<script>
    function onClickAndroidBtn()
        {
            var i = Math.round(Math.random() * 10);
            location.href = "https://www.zuoapp.com/app/goMyzo";
        }

    function onClickIOSBtn()
        {
            var i = Math.round(Math.random() * 10);
            if (i % 1 >= 0) {
                location.href = "https://www.zuoapp.com/app/goMyzo";
            }
            document.getElementById('iosAnchor').scrollIntoView();
        }
</script>
	</head>
	<link href="/down/css/style.css?v=<?=time()?>" rel="stylesheet">
	<body>
		<div class="wrapper">
			<h1 class="logo"></h1>
			<div class="app_logo"><img src="/down/images/logo.png" alt="" /></div>
			<div id="codo">掃描二維碼下載</div>
			<div class="button">
				<a id="android" onClick="onClickAndroidBtn()">Android下載</a>
				<a id="ios" onClick="onClickIOSBtn()">App Store下載</a>
			</div>
		</div>
		<div id="city_video"></div>
		<div class="x-landing-wrapper" id="wx_wrapper">
			<div class="x-landing-overlay"></div>
			<div class="wx-tips">
				<h3>如果您是用微信瀏覽的，請：</h3>
				<p>1、點選右上角選單。</p>
				<p>2、選擇【瀏覽器】打開，才能正常下載。</p>
				<div class="close" onclick="closeCL('wx_wrapper');">關閉</div>
			</div>
		</div>
		<script type="text/javascript" src="/down/js/common.js?v=<?=time()?>"></script>
	</body>
</html>