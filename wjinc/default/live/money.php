<link href="/skin/css/pt.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="//apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js" ></script>
<script type="text/javascript" src="/skin/layer/layer.js"></script>
<div class="charge_cont" style="display: block;">
	<h2 id="chargeTitle">真人娛樂金額轉換</h2>
	<form action="/live/ed?action=save" method="post" target="ajax" func="zz_submit">
	<?php include_once('live/mysqli.php');
	
		$username = @$this->user['username'];
		$sqlc = "select * from ssc_members where username='{$username}'";
			$result = $mysqli->query($sqlc);
			$row=$result->fetch_array();
			$user_money=$row['coin'];
	
	?>
	<div class="charge_input">
		<p>主帳戶: <b id="MBallCredit"><?=$user_money;?>元</b></p>
		<p>AG帳戶: <b id="MSunplusCredit">查詢中...</b></p>
		<p>BBIN帳戶:<b id="MSunplusCreditbb">查詢中...</b></p>
		<p>SS帳戶: <b id="MSunplusCreditss">查詢中...</b></p>
		<p>PT帳戶: <b id="MSunplusCreditpt">查詢中...</b></p>
		<p>KY帳戶: <b id="MSunplusCreditky">查詢中...</b></p>
		<p>轉換對象: 
			<select name="game" id="game">
				<option value="AG"><strong>AG娛樂場</strong></option>
				<option value="BB"><strong>BB視訓</strong></option>
				<option value="SS"><strong>皇冠體育</strong></option>
				<option value="PT"><strong>PT電子視訓</strong></option>
				<option value="KY"><strong>KY棋牌</strong></option>
			</select>
		</p>
		<p>转换类型: 
			<select name="type" id="zz_type">
				<option value="in"><strong>轉入遊戲</strong></option>
				<option value="out"><strong>從遊戲提現</strong></option>
			</select>
		</p>		
		<p>转换金额: 
			<input name="zz_money" type="text" value="" placeholder="請填寫金額" id="zz_money" value='100' onKeyUp="if(isNaN(value))execCommand('undo')">
			</p>
		<span id="trprocess" style="display: none;">轉帳中,請稍後...</span>
		<input type="button" value="確定" class="charge_btn" onClick="confirmChangeMoney()">
	</div>
	</form>
</div>

<script type="text/javascript">
   function ALL_money(){
        $.getJSON("/live/getdata?callback=?", function (json) {
            if (json.close == 1) {
               // parent.location.href = '/close';
            }
            $("#MBallCredit").html(json.user_money);
        });
    }
    function AG_money(){
        $.get("/live/balance?target=ag",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCredit").html(data);
        });
    }
    function BB_money(){
           $.get("/live/balance?target=bb",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditbb").html(data);
        });
    }
	function SS_money(){
         $.get("/live/balance?target=ss",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditss").html(data);
          
        });
    }
	function PT_money(){
        $.get("/live/balance?target=pt",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditpt").html(data);
        });
    }
	function KY_money(){
        $.get("/live/balance?target=ky",function(data){
          // data = eval('('+data+')');
           $("#MSunplusCreditky").html(data);
        });
    }
	AG_money(); 
	BB_money();
	SS_money();
	PT_money();
	KY_money();
//window.setInterval(AG_money, 10000); 
//window.setInterval(BB_money, 15000); 
//window.setInterval(MG_money, 18000); 
//window.setInterval(PT_money, 20000);
</script>
<script type="text/javascript">
function trim(str){ //删除左右两端的空格
	return str.replace(/(^\s*)|(\s*$)/g, "");
	}
function confirmChangeMoney(){
	var type=$('#zz_type').val()
	var game=$('#game').val()
	var zz_money=$('#zz_money').val()
        if(confirm("确定转账吗？")){
       
			wait();
            $.ajax({
                type:'get',
                url:'/live/ed?action=save',
                data:{'type':type,'zz_money':zz_money,'game':game},
                beforeSend:function(x){
                   // console.log(this.data.zz_type+" "+this.data.zz_money);
                },
                success:function(d){
					wait();
                    alert(d);
					//location.reload(true);
                    AG_money(); 
					//BB_money();
					//AB_money();
					//MG_money();
					//ALL_money();
					//PT_money();
                },
				complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				$('.layui-layer-loading1,.layui-layer-shade').hide()
				if(status=='timeout'){
					alert("超时");
				}
						if(status=='error'){
					alert("远程服务器错误，请稍候再试");
				}
				}
            })

        }
    }
	
function wait(){
var index = layer.load(1, {
  shade: [0.1,'#fff'], //0.1透明度的白色背景
  shadeClose:false
});
}	
</script>