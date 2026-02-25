<div id="user-setting-dom" class="common">
	<div class="head">
		<div class="name icon-yen">帳戶資金轉換</div>
		<div class="desc">平台資金與真人、電子遊戲、體育平台互轉</div>
	</div>
	<div class="body zjhz">
		<style>
			.zjhz table{border:none;margin:0 25px;}
			.zjhz table tr th{padding:5px 8px;border:1px solid #8CA9C2;width:200px}
			.zjhz table tr th input#zz_money{width:80px;padding:3px 5px;border-right:none;}
			.zjhz table tr th input.zzsubmit{width:35px;padding:3px 5px;}
			.zjhz b{color:red}
			li.zzli{list-style-type:none;}
		</style>
		<form action="/live/ed?action=save" method="post" target="ajax" func="zz_submit">
		<table>
		  <tr>
		    <th bgcolor="#F8E9E4" style="text-align:left">平台資金：<b><?=$this->user['coin'];?>USD</b></th>
		    <th style="text-align:center" bgcolor="#E3EBF1">從平台轉入</th>
		    <th style="text-align:center" bgcolor="#E6EFF3">轉出到平台</th>
		  </tr>
		  <tr>
		    <th bgcolor="#F8E9E4" style="text-align:left">AG娛樂場帳戶：<b id="aged"> 查詢中... </b></th>
		    <script language="javascript">setTimeout(function(){$.get('/live/balance?target=ag',function(data){ $('#aged').html(data);})},1000);</script>
		    <th style="text-align:center" bgcolor="#E3EBF1"><input type="text" name="zz_money" id="zz_money" value="轉入金額" onfocus="if(this.value=='轉入金額')this.value=''" onblur="if(this.value=='')this.value='轉入金額'"><input type="hidden" name="zz_type" value="1"/><input type="submit" class="zzsubmit"value="提交" ></th>
		    <th style="text-align:center" bgcolor="#E6EFF3"><input type="text" name="zz_money" id="zz_money" value="轉出金額" onfocus="if(this.value=='轉出金額')this.value=''" onblur="if(this.value=='')this.value='轉出金額'"><input type="hidden" name="zz_type" value="2"/><input type="submit" class="zzsubmit" value="提交" ></th>
		  </tr>
		  <tr>
		    <th bgcolor="#F8E9E4" style="text-align:left">BB娛樂場帳戶：<b id="bbed"> 查詢中... </b></th>
		    <script language="javascript">setTimeout(function(){$.get('/live/balance?target=bb',function(data){ $('#bbed').html(data);})},1000);</script>
		    <th style="text-align:center" bgcolor="#E3EBF1"><input type="text" name="zz_money" id="zz_money" value="轉入金額" onfocus="if(this.value=='轉入金額')this.value=''" onblur="if(this.value=='')this.value='轉入金額'"><input type="hidden" name="zz_type" value="11"/><input type="submit" class="zzsubmit" value="提交" ></th>
		    <th style="text-align:center" bgcolor="#E6EFF3"><input type="text" name="zz_money" id="zz_money" value="轉出金額" onfocus="if(this.value=='轉出金額')this.value=''" onblur="if(this.value=='')this.value='轉出金額'"><input type="hidden" name="zz_type" value="12"/><input type="submit" class="zzsubmit" value="提交" ></th>
		  </tr>
		  <tr>
		    <th bgcolor="#F8E9E4" style="text-align:left">MG娛樂場帳戶：<b id="mged"> 查詢中... </b></th>
		    <script language="javascript">setTimeout(function(){$.get('/live/balance?target=mg',function(data){ $('#mged').html(data);})},1000);</script>
		    <th style="text-align:center" bgcolor="#E3EBF1"><input type="text" name="zz_money" id="zz_money" value="轉入金額" onfocus="if(this.value=='轉入金額')this.value=''" onblur="if(this.value=='')this.value='轉入金額'"><input type="hidden" name="zz_type" value="21"/><input type="submit" class="zzsubmit" value="提交" ></th>
		    <th style="text-align:center" bgcolor="#E6EFF3"><input type="text" name="zz_money" id="zz_money" value="轉出金額" onfocus="if(this.value=='轉出金額')this.value=''" onblur="if(this.value=='')this.value='轉出金額'"><input type="hidden" name="zz_type" value="22"/><input type="submit" class="zzsubmit" value="提交" ></th>
		  </tr>
		  <tr>
		    <th bgcolor="#F8E9E4" style="text-align:left">PT娛樂場帳戶：<b id="pted"> 查詢中... </b></th>
		    <script language="javascript">setTimeout(function(){$.get('/live/balance?target=pt',function(data){ $('#pted').html(data);})},1000);</script>
		    <th style="text-align:center" bgcolor="#E3EBF1"><input type="text" name="zz_money" id="zz_money" value="轉入金額" onfocus="if(this.value=='轉入金額')this.value=''" onblur="if(this.value=='')this.value='轉入金額'"><input type="hidden" name="zz_type" value="31"/><input type="submit" class="zzsubmit" value="提交" ></th>
		    <th style="text-align:center" bgcolor="#E6EFF3"><input type="text" name="zz_money" id="zz_money" value="轉出金額" onfocus="if(this.value=='轉出金額')this.value=''" onblur="if(this.value=='')this.value='轉出金額'"><input type="hidden" name="zz_type" value="32"/><input type="submit" class="zzsubmit" value="提交" ></th>
		  </tr>
		</table>
		</form>
	</div>
	<div id="cash-intro" class="addon">
		<ul class="list">
			<li class="zzli"><span class="btn btn-red">平台資金</span> 可直接在<span class="color green">彩票中心</span>中使用，<span class="color red">視訊直播</span><span class="color green">體育</span><span class="color red">電玩</span>須先進行轉換。</li>
			<li class="zzli"><span class="btn btn-blue">轉換金額</span> 每次最少為<span class="color red">1</span>USD。</li>
			<li class="zzli"><span class="btn btn-green">電玩轉出</span> 請先退出所有電子遊戲房間再進行操作,否則無法轉出。</li>
		</ul>
	</div>
</div>
<script type="text/javascript">
$(function() {
	$('#home').removeClass('on');
	$('#live-money').addClass('on');
});
</script>