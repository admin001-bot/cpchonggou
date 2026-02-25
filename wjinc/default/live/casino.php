
<link href="/skin/css/pt.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="//apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js" ></script>
<script type="text/javascript" src="/skin/layer/layer.js"></script>
<div class="zryx_banner">
	<div class="content">
		<!--BBIN入口-->
		<div class="zryx_enter">
			<img src="/skin/img/pt/bg-img-yy.png?v=1.17.6.4" class="bg-img-yy">
			<div class="zryx_img">
				<a href="javascript:;" game-box="bb" onclick="window.open('/biapi/?game=bbin')">
				<img src="/skin/img/pt/pt-zr-img02.png?v=1.17.6.4"><span>進入遊戲</span>
				</a>
			</div>
			<div class="money-div">
				<p>您目前的BBIN餘額為:</p>
				<p class="bbinbalance" style="font-size:17px">￥ <span class="money-number" onclick="balance('BB');" id="MSunplusCreditbb" loading="0">查詢中...</span></p>
				<a href="javascript:;" onclick="zz();" class="recharge2">轉帳</a>
			</div>
		</div>
		<!--SS入口-->
		<div class="zryx_enter">
			<img src="/skin/img/pt/bg-img-yy.png?v=1.17.6.4" class="bg-img-yy">
			<div class="zryx_img">
				<a href="javascript:;" game-box="ss" onclick="window.open('/biapi/?game=ss')">
				<img src="/skin/img/pt/pt-zr-img01.png?v=1.17.6.4"><span>進入遊戲</span>
				</a>
			</div>
			<div class="money-div">
				<p>您目前的SS餘額為:</p>
				<p style="font-size:17px">￥ <span class="money-number"  onclick="balance('SS');" id="MSunplusCreditss" loading="0">查詢中...</span></p>
				<a href="javascript:;" onclick="zz();" class="recharge2">轉帳</a>
			</div>
		</div>
		<!--PT入口-->
		<div class="zryx_enter">
			<img src="/skin/img/pt/bg-img-yy.png?v=1.17.6.4" class="bg-img-yy">
			<div class="zryx_img">
				<a href="javascript:;" game-box="pt" onclick="window.open('/biapi/?game=pt')">
				<img src="/skin/img/pt/pt-zr-img01.png?v=1.17.6.4"><span>進入遊戲</span>
				</a>
			</div>
			<div class="money-div">
				<p>您目前的PT餘額為:</p>
				<p style="font-size:17px">￥ <span class="money-number" onclick="balance('PT');" id="MSunplusCreditpt" loading="0">查詢中...</span></p>
				<a href="javascript:;" onclick="zz();" class="recharge2">轉帳</a>
			</div>
		</div>
		<!--AG入口-->
		<div class="zryx_enter">
			<img src="/skin/img/pt/bg-img-yy.png?v=1.17.6.4" class="bg-img-yy">
			<div class="zryx_img">
				<a href="javascript:;" game-box="ag" onclick="window.open('/biapi/?game=ag')">
				<img src="/skin/img/pt/pt-zr-img01.png?v=1.17.6.4"><span>進入遊戲</span>
				</a>
			</div>
			<div class="money-div">
				<p>您目前的AG餘額為:</p>
				<p style="font-size:17px">￥ <span class="money-number"o onclick="balance('AG');"  id="MSunplusCredit" loading="0">查詢中...</span></p>
				<a href="javascript:;" onclick="zz();" class="recharge2">轉帳</a>
			</div>
		</div>
		
		<!--KY入口-->
		<div class="zryx_enter">
			<img src="/skin/img/pt/bg-img-yy.png?v=1.17.6.4" class="bg-img-yy">
			<div class="zryx_img">
				<a href="javascript:;" game-box="ky" onclick="window.open('/biapi/?game=ky')">
				<img src="/skin/img/pt/pt-zr-img01.png?v=1.17.6.4"><span>進入遊戲</span>
				</a>
			</div>
			<div class="money-div">
				<p>您目前的KY餘額為:</p>
				<p style="font-size:17px">￥ <span class="money-number" onclick="balance('KY');"  id="MSunplusCreditky" loading="0">查詢中...</span></p>
				<a href="javascript:;" onclick="zz();" class="recharge2">轉帳</a>
				
			</div>
		</div>
		
	</div>
</div>
<script type="text/javascript">
alert('如查詢失敗請先進入遊戲再返回查詢!!!');
	
	
    function AG_money(){
			 $("#MSunplusCredit").html('查詢中...');
        $.get("/live/balance?target=ag",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCredit").html(data);
        });
    }
    function BB_money(){
			 $("#MSunplusCreditbb").html('查詢中...');
           $.get("/live/balance?target=bb",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditbb").html(data);
        });
    }
	function SS_money(){
		 $("#MSunplusCreditss").html('查詢中...');
         $.get("/live/balance?target=ss",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditss").html(data);
          
        });
    }
	function PT_money(){
			 $("#MSunplusCreditpt").html('查詢中...');
        $.get("/live/balance?target=pt",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditpt").html(data);
        });
    }
	
	function KY_money(){
		 $("#MSunplusCreditky").html('查詢中...');
        $.get("/live/balance?target=ky",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditky").html(data);
        });
    }
	function balance(code){
		var func=code+"_money()";
		eval(func)
    }
	
	
	
	AG_money(); 
	BB_money();
	SS_money();
	PT_money();
	KY_money();
	/*
window.setInterval(AG_money, 10000); 
window.setInterval(BB_money, 15000); 
window.setInterval(SS_money, 18000); 
window.setInterval(PT_money, 20000);
window.setInterval(KY_money, 22000);*/
</script>
<script type="text/javascript">
$(function() {
	$('#home').removeClass('on');
	$('#live-money').addClass('on');
});
</script>
 <script type="text/javascript">
function zz(){
	layer.open({
	  type: 2,
	  area: ['400px', '390px'],//长  宽
	  zIndex:1888,
	  //fixed: false, //不固定
	  title:false,
	  scrollbar: false,//屏蔽滚动条
	  //maxmin: true,
	  content:'/live/money'
	  
	});
	return false;
}
</script>
<style>
.money-number:hover{
	cursor:pointer;
}

</style>