<?php
$APPVER = '?v=103';
?><!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
  	<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
  	<meta name="format-detection" content="telephone=no">
  	<title><?=$this->iff($args[0], $args[0] . '－'). $this->settings['webName']?></title>
  	
  	<style type="text/css">
  		body {background-color: #88a6b1}
  		#spinner {
  			width: 100%; 
  			height: 100%; 
  			background-color: rgba(0,0,0,.4);
  			opacity: 1;
  			position: absolute; 
  			z-index: 11;
  		}
  	</style>
  	
	<link href="/lib/ionic/css/ionic.min.css<?=$APPVER;?>" rel="stylesheet" />
  	<link href="/css/main.pack.min.css<?=$APPVER;?>" rel="stylesheet" />
  	<script src="/js/jquery.min.js<?=$APPVER;?>"></script>
	<script>var APPVER = '<?=$APPVER;?>'</script>
</head>

<body class="{{'skin_' + appConfig.skin}}" ng-app="ionicz" ng-controller="AppCtrl">
	<script src="/lib/spin.min.js<?=$APPVER;?>"></script>
	
	<ion-nav-bar class="bar-header bar-positive">
		<!-- <ion-nav-back-button></ion-nav-back-button> -->
	</ion-nav-bar>
  	<!-- <div ng-if="inited">
  		<ion-nav-view></ion-nav-view>
  	</div> -->
  	<ion-nav-view></ion-nav-view>
  	
  	<script id="test-template" type="text/ng-template">
	<div class="row">
		<div class="col">
			<div class="item item-input" ng-repeat="item in debugMsgList">{{item.time + ': ' + item.msg + ' - '+ item.count}}</div>
		</div>
	</div>
	</script>
</body>
	<script src="/config/config.js<?=$APPVER;?>"></script>
	
  	<script src="/lib/ionic/js/ionic.bundle.min.js<?=$APPVER;?>"></script>
  	<script type="text/javascript" src="/js/lib.pack.js<?=$APPVER;?>" ></script>

  	<script type="text/javascript" src="/js/app.pack.js<?=$APPVER;?>" ></script>
  	
  	<script src="/views/home/home.js<?=$APPVER;?>"></script>
  	<script src="/views/ucenter/ucenter.js<?=$APPVER;?>"></script>
  	<script src="/js/layer3/layer.js<?=$APPVER;?>"></script>
  	<script>
  	    function changeLanguage() {
            var status = $("#language_list").data("status");
            console.log('status: '+status);
            if(status == 0) {
                $("#language_list").show(500);
                $("#language_list").data("status", 1);
            } else {
                $("#language_list").hide(500);
                $("#language_list").data("status", 0);
            } 
        }
  	</script>
</html>