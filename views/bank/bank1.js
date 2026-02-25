angular.module('ionicz.bank')

.controller('BankBaseCtrl', function($scope, $log, Tools, My, $ionicHistory, $location, PATH) {
	$log.debug("BankBaseCtrl...");

	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	if ($scope.appConfig && $scope.appConfig['cashMax'] && $scope.appConfig['cashMax'] < 1) {
		$scope.appConfig['cashMax'] = '不限';
	}

    $scope.timestamp = new Date().getTime();

	$scope.back = function() {
		var backView = $ionicHistory.viewHistory().backView;
		if(!backView) {
			$location.path('/ucenter/index');
		}
		else {
			$location.path(backView.url);
		}
	};

	$scope.getBank = function(callback) {
		Tools.ajax({
			method: 'GET',
			url: '/mobile/userrech/detail.do',
			success: function(data) {
				if (data) {
					My.setBank(data);
				}
				if (angular.isFunction(callback)) {
					callback();
				}
			}
		});
	};
	$scope.parseIntMoney = function(t) {
		t.target.value = parseInt(t.target.value);
		if ("NaN" == t.target.value) {
			t.target.value="";
		}
		return t.target.value;
	};

	$scope.parseFloatMoneyInDepositPage = function(t) {
		t.target.value = t.target.value.replace(/[^0-9.]/g, "");
		if (!(parseFloat(t.target.value) > 0 &&  (/^\d+\.?\d{0,2}$/.test(t.target.value)) ) ) {
			t.target.value = parseFloat(t.target.value).toFixed(2);
		}
		if ("NaN" == t.target.value) {
			t.target.value="";
		} 
	};
	$scope.quickMoney = function(){
		$("#setmoney_quick li").bind({
			"click":function(){
				
				$("#setmoney_quick li").attr("class","");
				$("#amount").val($(this).attr("money"));
				$("input:disabled").removeAttr("disabled");
				$(this).attr("class","on");
				}
		});
	};
	$scope.checkDepositMoney = function(data, rechType) {
		if(data.depositMoney === undefined){
			data.depositMoney = $("#amount").val();
		}
		var s = data.depositMoney.charAt(data.depositMoney.length-1);
	    if(s=="."){
	    	data.depositMoney = data.depositMoney.substring(0, data.depositMoney.length-1);
	    }
	    var money = parseFloat(data.depositMoney);

	    //var mixMoney = $scope.getMixMoney(rechType);
	    //var maxMoney = $scope.getMaxMoney(rechType);

		//转账、第三方限额不同
		if (rechType.indexOf("nline") > 0){
			var mixMoney = $scope.appConfig.rechargeMinThird;
			var maxMoney = $scope.appConfig.rechargeMaxThird;
		}else{
			var mixMoney = $scope.appConfig.rechargeMin;
			var maxMoney = $scope.appConfig.rechargeMax;
		}

	    if (money<mixMoney) {
	    	layer.msg("存款金額不能小於"+mixMoney);
	    	return false;
	    }	    

	    if (money>maxMoney) {
	    	layer.msg("存款金額不能大於"+maxMoney);
	    	return false;
	    }

		var thirdPayId = $("#rechId").val();
		flag = true;
		$.ajax({
			type : "GET",
			url : "/userrech/onlinePay.do",
			async: false,
			data : {thirdPayId: thirdPayId,
				    amount: money,
					},
			dataType : "json",
			success : function(result) {		        
			   if(result > 0){
					alert('該付款方式最低金額為'+result+'元');
					flag = false;
			   }

			}
			
        });
		if(!flag){
		return flag;
        }
		return true;
	   
	};
	$scope.getMixMoney = function(rechType) {
		if (rechType && rechMoneyLimit[rechType] && rechMoneyLimit[rechType].mix) {
			return rechMoneyLimit[rechType].mix;
		}
		return rechMoneyLimit.defaultMoney.mix;
	};
	$scope.getMaxMoney = function(rechType) {
		if (rechType && rechMoneyLimit[rechType] && rechMoneyLimit[rechType].max) {
			return rechMoneyLimit[rechType].max;
		}
		return rechMoneyLimit.defaultMoney.max;
	};
	
})

.controller('BankController', function($scope, $log, Tools, My, UCenter) {

	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}


    $scope.timestamp = new Date().getTime();
	
	$scope.isMore = true;

	var getPage = function() {
		if(!$scope.dataList) {
			return 1;
		}
		var length = $scope.dataList.length;
		if (length < rows) {
			return 1;
		} else {
			return parseInt(length / rows + 1);
		}
	};
	var rows = 10;

	var getCoinlogPage = 0;
	$scope.get_coinlog = function() {
		if (!$scope.isMore) {
			return;
		}
		var url = '/mobile/coinlog/getCoinLogList.do';
		var page = getPage();
		getCoinlogPage++;
		if(getCoinlogPage !== page){
			return false;
		} 
		Tools.ajax({
			method: 'GET',
			params: {page: page, rows: rows},
			url: url,
			success: function(result) {
				 if(result && result.totalCount > 0) {
					 $scope.dataList = $scope.dataList || [];
					 $scope.dataList = $scope.dataList.concat(result.data);
					 for (var i = 0; i < $scope.dataList.length; i++) {
					 	if ($scope.dataList[i].liqType == "提現凍結") {
					 		$scope.dataList[i].liqType = "提現成功";
					 	}else if($scope.dataList[i].liqType == "提現成功扣除凍結金額"){
					 		$scope.dataList.splice(i,1);
					 	}else if($scope.dataList[i].liqType == "自動出款成功扣除凍結金額"){
							$scope.dataList.splice(i,1);
					 	}else if($scope.dataList[i].liqType == "提現失敗返回凍結金額"){
							$scope.dataList[i].liqType = "提現失敗";

					 	}
					 }
					 if (rows * page < result.totalCount) {
						 //$timeout(function(){$scope.isMore = true;}, 1500);
					 }
				 }
				 else {
					 $scope.dataList = [];
				 }
			}
		});
			$scope.$broadcast('scroll.infiniteScrollComplete');
	};

	
	$log.debug("銀行帳號: BankController..." );
	$scope.bankIcon = bankIcon;
	$scope.rechBankArray = [];
	$scope.$on('$ionicView.beforeEnter', function(event, viewData) {
		initRechBank();
		$scope.bankInit();
	});
	var initRechBank = function(){
		var rechBanks = PARAM_CFG["rech_bank"];
		for(var i in rechBanks) {
			var b=rechBanks[i];
			$scope.rechBankArray.push(b);
		}
	}
	$scope.bankInit = function() {
		if (UCenter.checkFundPwd()) {
			if (My.hasBankMsg()) {
				$scope.setStep(1); // 可以展示银行卡信息
				return;
			}
			$scope.getBank($scope.bankPageGetBankCallback);
		}
	};
	$scope.bankPageGetBankCallback = function() {
		if (My.hasBankMsg()) {
			$scope.setStep(1);
		} else {
			$scope.setStep(0);
		}
	};
	
	$scope.addBank = function() {
		if (!My.getFullName()) {
			UCenter.addRealName('完善個人資訊');
			return;
		}
		$scope.setStep(2);
	};
	$scope.mdfBankData = {};
	$scope.bindBank = function() {
		Tools.ajax({
			method: 'POST',
			url: '/mobile/user/bindBank.do',
			params: {
				bankId : $scope.mdfBankData.bankId,
				cardNo : $scope.mdfBankData.cardNo,
				subAddress : $scope.mdfBankData.address
			},
			success : function(data) {
				var tip = '成功加入銀行訊息';
				if ($scope.step == 3) {
					tip = '成功修改銀行訊息';
				}
				if(data=='ok'){
				layer.msg(tip);
				My.setBandDesc($scope.mdfBankData.bankName, $scope.mdfBankData.address, $scope.mdfBankData.cardNo);
				$scope.setStep(1);
				$scope.mdfBankData = {};
				}else{
				layer.msg(data);
				return false;
				}
			}
		});
	};
	$scope.setStep = function(step) {
		$scope.step = step;
		if (step == 3) {
			$scope.mdfBankData.bankName = My.getBank().bankName;
			$scope.mdfBankData.addressTip = My.getBank().subAddress;
//			$scope.mdfBankData.address = My.getBank().subAddress;
			$scope.mdfBankData.cardNoTip = "旧卡"+My.getBank().cardNo;
//			$scope.mdfBankData.cardNo = My.getBank().cardNo;
		}
	};
})

.controller('WithdrawController', function($scope, $log, $state, My, Tools, UCenter, md5) {

	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

    $scope.timestamp = new Date().getTime();

	$log.debug("WithdrawCtrl...");
	
	$scope.$on('$ionicView.beforeEnter', function(event, viewData) {
		$scope.withdrawInit();
	});
	
	$scope.showRealNameModal = function(title, callback) {
		UCenter.addRealName(title, callback);
	};
	
	$scope.withdrawInit = function() {
		if (UCenter.checkFundPwd()) { // 取款密码
			if (!My.hasBankMsg()) {
				$scope.getBank($scope.withdrawPageGetBankCallback);
			} else {
				$scope.withdrawPageGetBankCallback();
			}
		}
	};
	$scope.withdrawPageGetBankCallback = function() {
		if (!My.getFullName()) {
			$scope.withdrawStep = 1; // 需要完善用户信息-真实姓名
		}
		if (My.getFullName() && !My.hasBankMsg()) {
			$scope.withdrawStep = 2; // 需要绑定银行卡
		}
		if (My.getFullName() && My.hasFundPwd() && My.hasBankMsg()) {
			$scope.withdrawStep = 3; // 可以取款，展示取款页面
		}
	}
	$scope.withdrawData = {};
	$scope.num = 0;
	$scope.withdrawSubmit = function() {
		if ($scope.num === 1) return ;
		var amount = parseInt($scope.withdrawData.applyMoney);
		var drawcode = $scope.withdrawData.withdrawPwd;
		if (!amount) {
			layer.msg("請輸入提款金額");
			return;
		}
		if (!drawcode) {
			layer.msg('請輸入提款密碼');
			return;
		}
		if (amount > My.getMoney()) {
			layer.msg('餘額不足');
			return;
		}
		if (amount < $scope.appConfig.cashMin) {
			layer.msg('提現金額不能小於'+$scope.appConfig.cashMin+'元');
			return;
		}
		$scope.num = 1;
		Tools.ajax({
			method: 'POST',
			params: {
				coinpwd : drawcode,
				coinpwdmd5 : md5.createHash(drawcode),	
				amount : amount
			},//{amount : amount, fundPwd: md5.createHash(drawcode), fundPwdText:drawcode},
			url: '/mobile/withdraw/submit.do',
			success: function(g) {
				$scope.num = 0;
				if(g=='ok'){
					//layer.msg('申请提现成功，请等待客服人员审核');
					My.addMoney(-amount);
					$state.go("bank.trans", {type: 2});
					window.location.href="/mobile/#/bank/trans/2";
				}else{
					alert(g);
					return false;
				}
			},
			error:function(error){
				$scope.num = 0;
				layer.msg('網路或伺服器異常,請稍後再試');
			}
		});
	};
	$scope.parseIntMoneyInWithdrawPage = function(t) {
		$scope.withdrawData.applyMoney = $scope.parseIntMoney(t);
	};
})

.controller('TransController', function($rootScope, $scope, $stateParams, $timeout, $ionicModal, Tools, My, $interval) {


    $scope.timestamp = new Date().getTime();
	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	$scope.type = $stateParams.type;
$scope.CHECK_STATUS = {
	0 : '提現成功',
	1 : '申請中',
	2 : '已取消',
	3 : '提現成功',
	4 : '已失敗',
	5 : '已刪除',
	6 : '處理中',
	7 : '已失敗',
	8 : '提現成功',
};

$scope.RECH_STATUS = {
	0 : '處理中',
	1 : '存款成功',
	2 : '存款成功',
	3 : '已失敗',
	4 : '彩金',
	5 : '彩金',
	9 : '存款成功'
};	
	$scope.RECH_TYPE = {"onlinePayment" : '線上儲值', "weixin" : '微信轉帳', "alipay" : '支付寶轉帳', "cft" : '財付通轉帳', "bankTransfer" : '金融卡轉帳'};
	$scope.ThirdChannels = bank1;
	
	$scope.isMore = true;
	$scope.dataList = null;
	var rows = 10;
	
	var getPage = function() {
		if(!$scope.dataList) {
			return 1;
		}
		var length = $scope.dataList.length;
		if (length < rows) {
			return 1;
		} else {
			return parseInt(length / rows + 1);
		}
	};

	$scope.queryData = function() {
		if (!$scope.isMore) {
			return;
		}
		$scope.isMore = false;
		var url = $scope.type == 1 ? '/mobile/userrech/getRechList.do' : '/mobile/withdraw/getWithDrawList.do';
		var page = getPage();

		Tools.ajax({
			method: 'GET',
			params: {page: page, rows: rows},
			url: url,
			success: function(result) {
				 if(result && result.totalCount > 0) {
					 $scope.dataList = $scope.dataList || [];
					 $scope.dataList = $scope.dataList.concat(result.data);
					 if (rows * page < result.totalCount) {
						 $timeout(function(){$scope.isMore = true;}, 1500);
					 }
				 }
				 else {
					 $scope.dataList = [];
				 }
			}
		});

			$scope.$broadcast('scroll.infiniteScrollComplete');
	};

	$scope.rechDescData = {};
	$scope.showDetail = function(item) {
		$scope.item = item;
		var templateUrl = $scope.type == 1 ? 'rech-detail.html' : 'withdraw-detail.html';
		Tools.modal({
			scope: $scope,
			title: '看詳情',
			templateUrl: templateUrl,
			callback: function(scope, popup) {
				popup.close();
			}
		});
	};
})


.controller('RealTransController', function($scope, $log, $state, $filter, ENV, Tools, UCenter, BankService , My) {


    $scope.timestamp = new Date().getTime();
	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	//默认选中钱包
	$scope.cur_out	= '0';
	$scope.cur_in	= '1';
	$scope.loading	= false;

	$scope.onChangeCurOut = function name(params) {
		$scope.cur_out = params;
		$scope.loadBalance(params);
	}
	$scope.onChangeCurIn = function name(params) {
		$scope.cur_in = params;
		$scope.loadBalance(params);
	}

	//快捷金额
	$scope.cg_amount = function(amount) {
		if (amount == 'all'){
			var all_amount = $(".money"+$scope.cur_out).html();
			if (all_amount.length <= 20){
				$("#amount").val(all_amount);
			}
		}else{
			$("#amount").val(amount);
		}
	};

	
	setTimeout(function() {
		$scope.walletArr = [{
			name:'我的錢包',
			id:'0',
			money:0,
			reload:true
		}];
		if($scope.appConfig && $scope.appConfig.enabledReal){
			if ($scope.appConfig.enabledReal.indexOf('1') > -1 || $scope.appConfig.enabledReal.indexOf('2') > -1 || $scope.appConfig.enabledReal.indexOf('15') > -1 || $scope.appConfig.enabledReal.indexOf('17') > -1){
				$scope.walletArr.push({
					name:'AG / MG',
					id:'1',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('4') > -1 || $scope.appConfig.enabledReal.indexOf('6') > -1 || $scope.appConfig.enabledReal.indexOf('5') > -1){
				$scope.walletArr.push({
					name:'BBIN視訊',
					id:'4',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('9') > -1){
				$scope.walletArr.push({
					name:'HG視訊',
					id:'9',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('10') > -1){
				$scope.walletArr.push({
					name:'OG視訊',
					id:'10',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('16') > -1){
				$scope.walletArr.push({
					name:'PT電子',
					id:'16',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('11') > -1){
				$scope.walletArr.push({
					name:'沙巴體育',
					id:'11',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('14') > -1){
				$scope.walletArr.push({
					name:'VR彩票',
					id:'14',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('18') > -1){
				$scope.walletArr.push({
					name:'開元棋牌',
					id:'18',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('19') > -1){
				$scope.walletArr.push({
					name:'樂遊棋牌',
					id:'19',
					money:0,
					reload:true
				});
			}
			if ($scope.appConfig.enabledReal.indexOf('20') > -1){
				$scope.walletArr.push({
					name:'天豪棋牌',
					id:'20',
					money:0,
					reload:true
				});
			}
	}
	$scope.loadBalance('0');
	},200);
	
	//查询余额
	$scope.loadBalance = function(wallet) {
		var box = $scope.walletArr;
		$('#amount'+wallet).html('<img src="/images/new/loading.gif" border="0">');
		Tools.ajax({
			method: 'GET',
			url: '/mobile/real/getBalance/'+wallet,
			success: function(result) {
				if (result.amount != 'blank'){
					for(var i=0;i<box.length;i++){
						if(box[i].id == wallet){
							box[i].money = result.amount;
							box[i].reload = false;
						}
					}
				}
			},
			error:function (params) {
				$('#amount'+wallet).html('載入失敗');
			}
		});
	};

	

	//提交
	$scope.convert = function(wallet) {
		var amount	= $("#amount").val();
		if ($scope.cur_out == $scope.cur_in){
			layer.msg('不能轉入相同錢包。');
			return false;
		}
		if (!amount || amount<1){
			layer.msg('最小轉帳金額為 1 元。');
			return false;
		}
		$scope.loading	= true;
		Tools.ajax({
			method: 'GET',
			url: '/mobile/real/trans/'+$scope.cur_out+'/'+$scope.cur_in+'/'+amount,
			success: function(result) {
				$scope.loading	= false;
				if (result.cur_out_amount != 'blank'){
					$scope.loadBalance($scope.cur_out);
				}
				if (result.cur_in_amount != 'blank'){
					$scope.loadBalance($scope.cur_in);
				}
				console.log($scope.cur_out,$scope.cur_in);
				if($scope.cur_out == 0 || $scope.cur_in == 0){
					My.info.money = $scope.walletArr[0].money;
				}
				if(result.msg){
					layer.msg(result.msg);
				}else {
					layer.msg('轉換成功');
				}
			}
		});
	};

	$log.debug("RealTransController...");

})

.controller('RealTransLogController', function($scope, $log, $state, $filter, ENV, Tools, UCenter, BankService, $timeout) {


    $scope.timestamp = new Date().getTime();
	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	//转换记录
	$scope.isMore = true;

	var getPage = function() {
		if(!$scope.dataList) {
			return 1;
		}
		var length = $scope.dataList.length;
		if (length < rows) {
			return 1;
		} else {
			return parseInt(length / rows + 1);
		}
	};
	var rows = 10;

	$scope.get_trans = function() {
		if (!$scope.isMore) {
			return;
		}
		$scope.isMore = false;
		var url = '/mobile/real/getMyTrans';
		var page = getPage();
		
		Tools.ajax({
			method: 'GET',
			params: {page: page, rows: rows},
			url: url,
			success: function(result) {
				 if(result && result.totalCount > 0) {
					 $scope.dataList = $scope.dataList || [];
					 $scope.dataList = $scope.dataList.concat(result.data);
					 if (rows * page < result.totalCount) {
						 $timeout(function(){$scope.isMore = true;}, 1500);
					 }
				 }
				 else {
					 $scope.dataList = [];
				 }
			}
		});
			$scope.$broadcast('scroll.infiniteScrollComplete');
	};

})


.controller('DepositController', function($scope, $log, $state, $filter, ENV, Tools, UCenter, BankService) {
    $scope.timestamp = new Date().getTime();
	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	$log.debug("DepositController...");
	BankService.init(function(rechTypeMap) {
		//UCenter.checkFundPwd();
		$scope.rechTypeMap = rechTypeMap;
	});
})

.controller('OnlinePayController', function($scope, $log, $state, $cookies, $filter, ENV, Tools, UCenter, BankService) {


    $scope.timestamp = new Date().getTime();
	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	$scope.bankMap = bankMap;
	$scope.xSessionToken = $cookies.get('token');
	
	var rechType = $state.current.data.rechType;
	
	$scope.$on('$ionicView.beforeEnter', function(event, viewData) {
		$scope.onlinepayData = {};
		
		BankService.init(function(rechTypeMap) {
			//UCenter.checkFundPwd();
			$scope.rechTypeList = rechTypeMap[rechType] || [];
			if($scope.rechTypeList.length == 0) {
				return;
			}
			$scope.onlinepayData.payWay = $scope.rechTypeList[0];
		});
	});
	$scope.num = 0;
	$scope.onlinePay = function(formObj) {
		$scope.num = 1;
		if (!$scope.checkDepositMoney($scope.onlinepayData, rechType)) {
			return false;
		}
		
		$scope.setFormAction($scope.onlinepayData);
		$scope.showSubmitData();
		var rechId = $("#rechId").val();
		var payId = $("#payId").val();
		var amount = $("#amount").val();
		document.getElementById("onlinepay-form").action = document.getElementById("onlinepay-form").action + '?rechId='+rechId+'&payId='+payId+'&amount='+amount;
		document.getElementById("onlinepay-form").submit();
		return true;
		$scope.num = 0;
	};
	$scope.setFormAction = function(onlinepayData) {
		var formUrl = "/mobile/userrech/onlinePay.do";
		//console.log(onlinepayData.payWay.domain);
		if (onlinepayData && onlinepayData.payWay && onlinepayData.payWay.domain) {
			formUrl = onlinepayData.payWay.domain + "/mobile/userrech/onlinePay.do";
		}
		document.getElementById("onlinepay-form").setAttribute("action", formUrl);
	};
	$scope.showSubmitData = function() {
		/*
		Tools.modal({
			scope:$scope,
			title: '支付信息',
			templateUrl: 'submitData-template',
			callback: function(scope, popup) {
				$state.go("bank.trans", {type: 1});
				popup.close();
			}
		});
		*/
	};
})

.controller('OfflinePayController', function($scope, $log, $state, $filter, ENV, Tools, UCenter, BankService) {


    $scope.timestamp = new Date().getTime();
	//默认不显示红包
	if ($scope.appConfig){
		$scope.appConfig.show_bonus_act = 0;
	}

	var rechType = $state.current.data.rechType;
	
	$scope.$on('$ionicView.beforeEnter', function(event, viewData) {
		$scope.bankStep = 1;
		$scope.depositData = {};

        $scope.timestamp = new Date().getTime();
		
		BankService.init(function(rechTypeMap) {
			//UCenter.checkFundPwd();
			$scope.rechTypeList = rechTypeMap[rechType];
			$scope.depositData.bankObj = $scope.rechTypeList[0];
			var now = new Date();
			$scope.depositData.depositDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
		});
	});
	$scope.isDoPay = false;
	$scope.bankNextStep = function(data) {
		if (!$scope.checkDepositMoney(data, rechType)) {
			return;
		}
		$scope.setBankStep(3);
		$scope.isDoPay = true;
	};
	$scope.setBankStep = function(step) {
		$scope.bankStep = step;
	};

	$scope.copyPayeeName = function() {
		if($scope.checkVersion()){
	  		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("payeeNameIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                  
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("payeeName");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
    };

	$scope.copyBankAddress = function() {
		if($scope.checkVersion()){
	  		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("bankAddressIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                  
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("bankAddress");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
    };

	$scope.copyAccount = function() {
		if($scope.checkVersion()){
	  		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("bankAccountIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                  
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("bankAccount");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
    };

	$scope.copyDomain = function() {
		if($scope.checkVersion()){
			if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("domainIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                   
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("domain");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
    };

	$scope.copyAliAccount = function() {
		if($scope.checkVersion()){
	  		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("aliAccountIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                  
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("aliAccount");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
	};

	$scope.copyAddress = function() {
		if($scope.checkVersion()){
	  		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("addressIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                  
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("address");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
	};

	$scope.copyQrCode = function() {
		if($scope.checkVersion()){
	  		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备  
                window.getSelection().removeAllRanges();  
                var Acc=document.getElementById("qrCodeIos");
                var range = document.createRange();               
                range.selectNode(Acc);                
                window.getSelection().addRange(range);                  
                var successful = document.execCommand('copy');                              
                window.getSelection().removeAllRanges();  
				layer.msg("複製成功");
			}else{  
				Acc=document.getElementById("qrCode");
				Acc.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				layer.msg("複製成功");
			}
		}
	};

	$scope.num = 0;
	$scope.doPay = function(data) {
		$scope.num = 1;
		if (!$scope.isDoPay) {
			return;
		}
		$scope.isDoPay = false;
		var date = $filter('date')(data.depositDate, 'yyyy-MM-dd HH:mm:ss');
		Tools.ajax({
			method: 'POST',
			params: {
				cfgId: data.bankObj.id,
				amount: data.depositMoney,
				rechId: data.bankObj.id,
				rechName: data.bankObj.rechName,
				rechName2: data.rechName2,
				username: data.depositUsername,
				rechargeRemarks: data.rechargeRemarks,
				depositTime: date
			},
			url: '/mobile/Userrech/save.do',
			success: function(result) {
				$scope.num = 0;
				if(result=='404'){
					layer.msg('此入款方式已關閉，請選擇其他入款通道');
					$state.go("bank.deposit", {type: 2});
					return;
				}
				if(result=='500'){
					layer.msg('此入款方式已關閉，請選擇其他入款通道2');
					$state.go("bank.deposit", {type: 2});
					return;
				}
				if (result.rechargeId){
					var template = '<style>.popup-body>li{list-style:none;}button.button.ng-binding.button-positive {border-color: transparent; background-color: #387ef5 !important; color: #fff;}</style><li >儲值編號：' + result.rechargeId + '</li>'
									+'<li>二維碼：</li>'
									+'<li><img src="' + '/customise/images/sysbank_' + $scope.depositData.bankObj.id + '.jpg?t=' + $scope.timestamp + '"/></li>';
					Tools.modalNoCancel({
						title: '公司入款方式',
						template: template,
						callback: function(scope, popup) {
							popup.close();
							$state.go("bank.trans", {type: 1});
						}
					});
				}else{
					layer.msg(result);
					return;
				}
			}
		});
	};

	$scope.checkVersion = function (){
		var navigatorStr= navigator.userAgent.toLowerCase();
		var navigatorVer = 11;
		if(navigatorStr.match(/cpu iphone os (.*?) like mac os/) && navigatorStr.match(/cpu iphone os (.*?) like mac os/)[1]){
			navigatorVer= navigatorStr.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g,".");
		}
		//IOS复制低于10版本不支持，需提示用户
		if(navigatorVer < 10){
			layer.msg("複製失敗,系統版本不支援");
			return false;
		}else {
			return true;
		}
	}
})

.service('BankService', ['$log', 'Tools', function($log, Tools) {
	var rechTypeCfgArray = [];
	var rechTypeMap = {};
	var inited = false;
	
	var initBaseRechType = function() {
		var rechTypeList = PARAM_CFG["rech_type"];
		if (!rechTypeList || rechTypeList.length == 0) {
			Tools.alert('配置缺失');
			return;
		}
		for (var i in rechTypeList) {
			if (rechTypeList[i].open == 0) { // 0-开， 1-关
				rechTypeCfgArray.push(rechTypeList[i].value);
			}
		}
	};
	
	var initUserRechType = function(callback) {
		// 先初始化基础充值配置
		initBaseRechType();
		
		Tools.ajax({
			method: 'GET',
			url: '/mobile/Userrech/getUserRechCfg.do',
			success: function(result) {
				if (!result) {
					return;
				}
				var onlineData = []; // 在线充值源数据
				var otherData = []; // 非在线充值源数据
				
				for(var i in result) {
					var obj = result[i]; 
//					console.log(obj);
					// 如果充值大类已经关闭
					if(rechTypeCfgArray.indexOf(obj.rechType) == -1) {
						continue;
					}
					if (obj.rechType == "onlinePayment") {
						onlineData.push(obj);
					} else {
						otherData.push(obj);
					}
				}
				/** 处理在线充值数据 start bf[1], sf[2], ht[3/5], htwx[4] */
				/*PC手机排序保持一致，取数据时已做排序
				var sort = [1, 3, 5, 4, 2, 6]; // 显示顺序：宝付[1]/汇通[3/5]/微信汇通[4]/闪付[2]/支付宝-闪付[6]
				onlineData.sort(function(a, b) {
					return sort.indexOf(a.onlineType) > sort.indexOf(b.onlineType);
				});
				*/
				var bankTransferPayList = [];
				var yunshanfuTransferList = [];
				var wechatAlipayTransferList = [];//微信支付宝转账
				var qqpayTransferList = [];
				var bankOnlinePayList = [];
				var quickOnlinePayList = [];
				var weixinOnlinePayList = [];
				var weixinPayList = [];
				var cftOnlinePayList = [];
				var cftPayList = [];
				var qqOnlinePayList = [];
				var alipayOnlineList = [];
				var baiduOnlineList = [];
				var jingdongOnlineList = [];
				var yinlianOnlineList = [];
				var aliPayList = [];
				for(var i in onlineData) {
					var obj = onlineData[i];

					if(obj.onlineType == 2) {
						bankOnlinePayList.push({id: obj.id, payid: obj.id, order: (bankOnlinePayList.length + 1), onlineType: obj.onlineType, domain:obj.domain, showName: obj.payeeName});
					}
					else if(obj.onlineType == 8) {
						quickOnlinePayList.push({id: obj.id, payid: obj.id, order: (quickOnlinePayList.length + 1), onlineType: obj.onlineType, payCode: 'QUICK', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName});
					}
					else if(obj.onlineType == 4) {
						weixinPayList.push({id: obj.id, payid: obj.id, order: (weixinPayList.length + 1), onlineType: obj.onlineType, payCode: 'WEIXIN', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName});
					}
					else if(obj.onlineType == 20) {
						yunshanfuTransferList.push({id: obj.id, payid: obj.id, order: (yunshanfuTransferList.length + 1), onlineType: obj.onlineType, payCode: 'YUNSHANFU', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName});
					}					
					else if(obj.onlineType == 21) {
						qqpayTransferList.push({id: obj.id, payid: obj.id, order: (qqpayTransferList.length + 1), onlineType: obj.onlineType, payCode: 'YUNSHANFU', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName});
					}					
					else if(obj.onlineType == 22) {
						wechatAlipayTransferList.push({id: obj.id, payid: obj.id, order: (wechatAlipayTransferList.length + 1), onlineType: obj.onlineType, payCode: 'wechatalipay', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName});
					}
					else if(obj.onlineType == 16) {
						aliPayList.push({id: obj.id, payid: obj.id, order: (aliPayList.length + 1), onlineType: obj.onlineType, payCode: 'ALIPAY', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName, address:obj.address, qrCode:obj.qrCode});
					}
					else if(obj.onlineType == 5) {
						bankTransferPayList.push({id: obj.id, payid: obj.id, rechName: obj.address, payeeName: obj.domain, showName: obj.payeeName, address: obj.qrCode, payee: obj.account, order: (bankTransferPayList.length + 1), onlineType: obj.onlineType, payCode: 'ZZ', domain:obj.domain});
					}					
					else if (obj.onlineType == 6) {
						alipayOnlineList.push({id: obj.id, payid: obj.id, order: (alipayOnlineList.length + 1), onlineType: obj.onlineType, payCode: '758', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 7) {
						weixinOnlinePayList.push({id: obj.id, payid: obj.id, order: (weixinOnlinePayList.length + 1), onlineType: obj.onlineType, payCode: '57', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 9) {
						weixinOnlinePayList.push({id: obj.id, payid: obj.id, order: (weixinOnlinePayList.length + 1), onlineType: obj.onlineType, payCode: '2', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 12) {
						cftOnlinePayList.push({id: obj.id, payid: obj.id, order: (cftOnlinePayList.length + 1), onlineType: obj.onlineType, payCode: 'cft', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 3) {
						cftPayList.push({id: obj.id, payid: obj.id, order: (cftPayList.length + 1), onlineType: obj.onlineType, payCode: 'cfttrans', domain:obj.domain, showName: obj.payeeName, account:obj.account, payeeName:obj.payeeName, rechName:obj.payeeName});
					}
					else if (obj.onlineType == 14) {
						qqOnlinePayList.push({id: obj.id, payid: obj.id, order: (qqOnlinePayList.length + 1), onlineType: obj.onlineType, payCode: 'qq', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 10) {
						alipayOnlineList.push({id: obj.id, payid: obj.id, order: (alipayOnlineList.length + 1), onlineType: obj.onlineType, payCode: 'ZHIFUBAO', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 17) {
						baiduOnlineList.push({id: obj.id, payid: obj.id, order: (baiduOnlineList.length + 1), onlineType: obj.onlineType, payCode: 'baidu', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 18) {
						jingdongOnlineList.push({id: obj.id, payid: obj.id, order: (jingdongOnlineList.length + 1), onlineType: obj.onlineType, payCode: 'jingdong', domain:obj.domain, showName: obj.payeeName});
					}
					else if (obj.onlineType == 19) {
						yinlianOnlineList.push({id: obj.id, payid: obj.id, order: (yinlianOnlineList.length + 1), onlineType: obj.onlineType, payCode: 'yinlian', domain:obj.domain, showName: obj.payeeName});
					}
					else {
						bankOnlinePayList.push({id: obj.id, payid: obj.id, order: (bankOnlinePayList.length + 1), onlineType: obj.onlineType, domain:obj.domain, showName: obj.payeeName});
					}
				}
				rechTypeMap['bankTransfer'] = bankTransferPayList;
				rechTypeMap['bankOnline'] = bankOnlinePayList;
				rechTypeMap['quickOnline'] = quickOnlinePayList;
				rechTypeMap['weixinOnline'] = weixinOnlinePayList;
				rechTypeMap['alipay'] = aliPayList;
				rechTypeMap['weixin'] = weixinPayList;
				rechTypeMap['cftOnline'] = cftOnlinePayList;
				rechTypeMap['cft'] = cftPayList;
				rechTypeMap['qqOnline'] = qqOnlinePayList;
				rechTypeMap['alipayOnline'] = alipayOnlineList;
				rechTypeMap['baiduOnline'] = baiduOnlineList;
				rechTypeMap['jingdongOnline'] = jingdongOnlineList;
				rechTypeMap['yinlianOnline'] = yinlianOnlineList;
				rechTypeMap['yunshanfuTransfer'] = yunshanfuTransferList;
				rechTypeMap['qqpayTransfer'] = qqpayTransferList;
				rechTypeMap['wechatAlipayTransfer'] = wechatAlipayTransferList;
				
				/** 处理在线充值数据 end */
				
				/** 处理非在线充值数据 start */
				for(var i in otherData) {
					var obj = otherData[i];
					var list = rechTypeMap[obj.rechType] || [];
					list.push(obj);
					rechTypeMap[obj.rechType] = list;
				}
				/** 处理非在线充值数据 end */
				
				if(angular.isFunction(callback)) {
					callback(rechTypeMap);
				}
			}
		});
	};
	
	this.init = function(callback) {
		if(!inited) {
			initBaseRechType();
			initUserRechType(callback);
			inited = true;
		}
		else {
			if(angular.isFunction(callback)) {
				callback(rechTypeMap);
			}
		}
	};
}])

;