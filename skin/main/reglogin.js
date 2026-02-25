function registerBeforSubmit(){
	var type=$('[name=type]:checked',this).val();
	if(!this.username.value) throw('沒有輸入使用者名稱');
	if(!/^\w{4,16}$/.test(this.username.value)) throw('使用者名稱由4到16位的字母、數字及底線組成');
	if(!this.password.value) throw('請輸入密碼');
	if(this.password.value.length<6) throw('密碼至少6位');
	if(!this.cpasswd.value) throw('請輸入確認密碼');
	if(this.cpasswd.value!=this.password.value) throw('兩次輸入密碼不一樣');
}
function registerSubmit(err,data){
	if(err){
		alert(err);
	}else{
	   
		alert(data.data);
		location='/user/login';
	}
	$("#vcode").trigger("click");
}
function userBeforeLogin(){
	var u=this.username.value;
	var v=this.vcode.value;
	if(!u || u=='帳號'){alert("請輸入使用者名稱");}
	else if(!v || v=='驗證碼'){alert("請輸入驗證碼");}
	else{return true;}
	return false;
}
function userLogin(err, data){
	if(err){
		alert(err);
		$('input[name=vcode]')
		.val('')
		.closest('div')
		.find('.ico-code img')
		.click();
	}else{
		location='/';
		//location='/index.php/user/loginto';
	}
}
function userBeforLoginto(){
        var u=this.username.value;
	var p=this.password.value;
	if(!u || u=='帳號'){alert("請輸入使用者名稱");}
	else if(!p || p=='xx@x@x.x'){alert("請輸入密碼");}
	else{return true;}
	return false;
}
function userLoginto(err, data){
	if(err){
		alert(err);
		
	}else{
		location='/';
	}
}