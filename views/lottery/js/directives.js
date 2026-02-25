angular.module('ionicz.lottery')

.directive('myPopover', function() {
	return {
		restrict: 'C',
		scope: true,
		link: function(scope, element, attrs) {
			element.find('a').bind('click', function() {
				scope.popover.hide();
			});
		}
	}
})

.directive('scrollbarX', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if(element.attr('scrollbar-x') == 'false') {
				element.removeClass('scroll-x');
			}
		}
	}
})

/**
 * 下注项指令
 * 该指令实现以下功能：
 * 1：根据元素上填写的data-id填充该玩法的赔率显示在页面；
 * 2：记忆选中状态，如果之前是选中状态，切换回来默认选中；
 * 3：点击事件，点击切换选中和未选中
 */
.directive('bet', function(Lottery) {
	return {
		restrict: 'C',
		scope: true,
		link: function(scope, element, attrs) {
			var dataId = element.attr('data-id');
			var oddsElement = angular.element(element[0].querySelector('.bet-item'));
			var play = Lottery.getPlay(dataId);
			if(!play) {
				oddsElement.html('--');
			}
			else {
				if(scope.isExist(dataId)) {
					element.addClass('bet-choose');
				}
				
				oddsElement.html(play.odds);
				
				element.bind('click', function() {
					if(scope.shareData.lotteryState != 1) {
						return;
					}
					var selected = element.hasClass('bet-choose');
					// 如果已经是选中状态，移除
					if(selected) {
						scope.removeDataId(dataId);
					}
					else {
						scope.addDataId(dataId);
					}
					
					element.toggleClass('bet-choose');
				});
			}
		}
	}
})

.directive('subBet', function(Lottery) {
	return {
		restrict: 'C',
		scope: false,
		link: function(scope, element, attrs) {
			var dataId = element.attr('data-id');
			
			var play = Lottery.getPlay(dataId);
			if(play) {
				var oddsElement = angular.element(element[0].querySelector('.bet-item'));
				oddsElement.html(play.odds);
			}
			
			element.bind('click', function() {
				if(scope.shareData.lotteryState != 1) {
					return;
				}
				var selected = element.hasClass('bet-choose');
				var flag = false;
				// 如果已经是选中状态，移除
				if(selected) {
					flag = scope.removeNum(dataId);
				}
				else {
					flag = scope.addNum(dataId);
				}
				
				if(flag) {
					element.toggleClass('bet-choose');
				}
			});
		}
	}
})

.directive('perio', function($rootScope, $filter, $timeout, $interval, $log, Tools, Lottery) {
    var lotteryStyle = {};
    var tpl = {};

    // 获取下一期数据的 URL
    var getNextIssueUrl = function(gameId) {
        return Tools.staticPath() + 'data/NextIssue.js?gameId=' + gameId + '&_' + Math.random();
    };

    // 获取当前开奖数据的 URL
    var getCurIssueUrl = function(gameId) {
        return Tools.staticPath() + 'data/CurIssue.js?gameId=' + gameId + '&_' + Math.random();
    };

    return {
        restrict: 'C',
        scope: true,
        template: 
        '<div>' +
            '<div class="pre-perio">' +
                '<div class="col item" ng-show="codeHtml.length > 0">' +
                    '<span class="span-fl span-pt">{{preIssue}}期</span>' +
                    '<div class="lottery-nums" ng-bind-html="codeHtml"></div>' +
               '</div>' +
            '</div>' +
            
            '<div class="cur-perio" ng-show="curIssue">' +
                '<div class="col item">' +
                    '<span>{{curIssue}}期 開獎:</span><span class="time">{{endTimeHtml}}</span><span>封盤 :</span> <span class="time">{{lotteryTimeHtml}}</span>' +
                '</div>' +
            '</div>' +
        '</div>',
        replace: true,
        link: function(scope, element, attrs) {
            $log.debug('---------perio link-----------, ' + scope.gameId);

            // 初始化计时器
            var mainTimer = null;
            var nextIssueTimer = null;
            var curIssueTimer = null;

            // 初始化作用域变量
            scope.curIssue = null;
            scope.preIssue = null;
            var gameId = scope.gameId;

            // 过滤封盤时间的显示，基于服务端倒计时
            var filterEndHtml = function(endDiffSecond) {
                if (endDiffSecond < 0) endDiffSecond = 0;
                scope.endTimeHtml = $filter('tick')(endDiffSecond, '開獎中');
            };

            // 过滤开奖时间的显示，基于服务端倒计时
            var filterLotteryHtml = function(lotteryDiffSecond) {
                if (lotteryDiffSecond < 0) lotteryDiffSecond = 0;
                scope.lotteryTimeHtml = $filter('tick')(lotteryDiffSecond, 'The lottery is in progress');
            };

            // 处理当前期的开奖结果显示
            var processCode = function (scope, nums) {
                $log.debug('processCode, ' + nums);
                if (!nums) return;
                
                if (!angular.isArray(nums)) nums = nums.split(',');
                if (nums.length < 3) return;
                
                scope.codeHtml = $filter('codeHtml')(nums, gameId, 'lottery');
            };

            // 启动下一期倒计时，使用服务器的 `serverTime` 作为基准
            function startNextTimer() {
                $interval.cancel(nextIssueTimer);

                Tools.lazyLoad([getNextIssueUrl(gameId)], function() {
                    if (!nextIssueData) return;
                    
                    var curIssue = parseInt(nextIssueData.issue);
                    scope.shareData.curIssue = curIssue;
                    scope.curIssue = curIssue;
                    scope.preIssue = parseInt(nextIssueData.preIssue);

                    var serverTime = moment(nextIssueData.serverTime); // 服务器时间
                    scope.serverTime = nextIssueData.serverTime;
                    var endTime = moment(nextIssueData.endtime);        // 封盤时间
                    var lotteryTime = moment(nextIssueData.lotteryTime);// 开奖时间

                    var endDiffSecond = endTime.diff(serverTime, 's');   // 计算封盤倒计时
                    var lotteryDiffSecond = lotteryTime.diff(serverTime, 's'); // 计算开奖倒计时

                    // 检查是否为封盤状态
                    if (endDiffSecond < -60 * 30) {
                        $interval.cancel(nextIssueTimer);
                        scope.endTimeHtml = $filter('tick')(endDiffSecond, '未開盤');
                        scope.lotteryTimeHtml = $filter('tick')(endDiffSecond, '未開盤');
                        scope.shareData.lotteryState = -1;
                        return;
                    }
                    
                    // 封盤状态判断
                    if (endDiffSecond > 60 * 20 && gameId != 70) {
                        scope.shareData.lotteryState = 0;
                    } else if (endDiffSecond <= 0) {
                        stop();
                    } else {
                        scope.shareData.lotteryState = 1;
                    }
                    
                    // 渲染初始倒计时
                    filterEndHtml(endDiffSecond);
                    filterLotteryHtml(lotteryDiffSecond);

                    // 每秒更新倒计时
                    nextIssueTimer = $interval(function() {
                        endDiffSecond--;
                        lotteryDiffSecond--;

                        filterEndHtml(endDiffSecond);
                        filterLotteryHtml(lotteryDiffSecond);

                        // 当倒计时为 0 时，重新获取下一期数据
                        if (endDiffSecond <= 0 || lotteryDiffSecond <= 0) {
                            startNextTimer();
                        }
                    }, 1000);
                });
            };
            
            // 获取当前开奖数据
            function getCurIssue() {
                $log.debug('取得目前開獎數據');
                
                Tools.lazyLoad([getCurIssueUrl(gameId)], function() {
                    if (!curIssueData) return;
                    
                    processCode(scope, curIssueData.nums);
                    $log.debug('scope.curIssue: ' + scope.curIssue + ', curIssueData.issue: ' + curIssueData.issue);
                    
                    if (scope.curIssue - curIssueData.issue <= 1) {
                        $log.debug('取得到開獎數據，停止目前定時器');
                        scope.preIssue = curIssueData.issue;
                        $interval.cancel(curIssueTimer);
                    } else {
                        $log.debug('開獎數據尚未獲取');
                    }
                });
            };

            // 启动主要倒计时（30秒刷新一次）
            function startMainTimer() {
                mainTimer = $interval(function() {
                    startNextTimer();
                }, 30000);
            };

            // 启动获取开奖数据的定时器
            function startCurIssueTimer() {
                $interval.cancel(curIssueTimer);
                curIssueTimer = $interval(function() {
                    getCurIssue();
                }, 2000, 60);
            };

            // 停止倒计时
            function stop() {
                scope.shareData.lotteryState = 0;
                $interval.cancel(mainTimer);
                $interval.cancel(nextIssueTimer);
                $interval.cancel(curIssueTimer);
                scope.reset();
            }
            
            scope.$watch('curIssue', function(newValue) {
                if (!newValue) return;
                if (newValue - scope.preIssue >= 2) {
                    $timeout(startCurIssueTimer, 30000, false);
                }
            });
            
            // 监听并初始化倒计时和获取数据
            scope.$on('lotteryInited', function($scope) {
                startNextTimer();  // 开启下一期倒计时
                getCurIssue();     // 获取当前期开奖号码
                startMainTimer();   // 开启30秒刷新总计时器
            });
            
            // 监听并销毁计时器
            scope.$on('lotteryDestroy', function($scope) {
                $interval.cancel(mainTimer);
                $interval.cancel(nextIssueTimer);
                $interval.cancel(curIssueTimer);
            });
        }
    };
})





.directive('lotteryTimer', function($rootScope, $filter, $interval, $log, Tools) {
	var diffTime = $rootScope.diffTime;
	var mainTimer = null;
	var allIssueTimer = null;
	var timeMap = {};
	return {
		restrict: 'EC',
		scope: false,
		template: '<div class="item" ng-repeat="game in gameList track by game.id"><a href="#/lottery/index/{{game.id}}"><h3>{{game.name}}</h3><span>{{texts[game.id]}}<ion-spinner ng-show="!texts[game.id]" class="spinner spinner-ios"></ion-spinner></span></a></div>',
		replace: true,
		link: function(scope, element, attrs) {
			scope.texts = {};
			
			var startTimer = function() {
				$interval.cancel(allIssueTimer);
				
				Tools.lazyLoad([Tools.staticPath() + 'data/' + 'allNextIssue.js?_' + Math.random()], function() {
					if(!allNextIssueData) {
						return;
					}
				
					for(var gameId in allNextIssueData) {
						var issueDate = allNextIssueData[gameId];
						var nowTime = moment().add(diffTime, 's');
	                	var lotteryTime = moment(issueDate.lotteryTime);
	                	var lotteryDiffSecond = lotteryTime.diff(nowTime, 's'); // 开奖倒计时
	                	timeMap[gameId] = lotteryDiffSecond;
					}
					
					allIssueTimer = $interval(function() {
						var isRestart = false;
                		for(var gameId in timeMap) {
                			var lotteryDiffSecond = timeMap[gameId];
                			if(lotteryDiffSecond < -60 * 30) {
                				scope.texts[gameId] = 'Not open';
                			}
                			else {
                				scope.texts[gameId] = $filter('tick')(lotteryDiffSecond, '正在開獎中');
                			}
                			lotteryDiffSecond--;
                			timeMap[gameId] = lotteryDiffSecond;
                			if(lotteryDiffSecond == 0) {
                				isRestart = true;
    	                	}
                		}
                		if(isRestart) {
                			startTimer();
                		}
                	}, 30000);
				});
			}
			
			startTimer();
			
			mainTimer = $interval(function() {
				startTimer();
        	}, 10000);
			
			scope.$on('lotteryListDestroy', function($scope) {
				$log.debug('------------lotteryListDestroy------------');
				$interval.cancel(mainTimer);
				$interval.cancel(allIssueTimer);
			});
		}
	}
})

.directive('zodiac', function($interpolate) {
	// 所有生肖集合
	var zodiacs = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
	// 当前年份，后续应该是从后端获取
	var animalsYear = '猪';
	
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {
			var text = attrs['zodiac'];
			var max = attrs['max'] || 49;
			var zodiacIndex = zodiacs.indexOf(animalsYear); // 8
			var index = zodiacs.indexOf(text); // 10
			if(zodiacIndex < index) {
				zodiacIndex += 12;
			}
			
			var tmp = $interpolate('<span class="round-3 {{num|lhcColor}}">{{num}}</span>');
			var html = '';
			var m = (zodiacIndex - index) + 1;
			var num = m;
			while(num <= max) {
				html += tmp({num: num});;
				num += 12;
			}
			element.append(html);
		}
	}
})
;