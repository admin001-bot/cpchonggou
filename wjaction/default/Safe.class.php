<?php
@session_start();
class Safe extends WebLoginBase{
	/**
	 * 设置密码
	 */
	public final function setPasswddo(){
		$opwd=$_POST['oldPwd'];
		if(!$opwd) { echo '原密碼不能為空';exit;}
		if(strlen($opwd)<6) { echo '原密碼至少6位';exit;}
		if(!$npwd=$_POST['newPwd']) { echo '密碼不能為空';exit;}
		if(strlen($npwd)<6) { echo '密碼至少6位';exit;}
		
		$sql="select password from {$this->prename}members where uid=?";
		$pwd=$this->getValue($sql, $this->user['uid']);
		
		$opwd=md5($opwd);
		if($opwd!=$pwd) { echo '原密碼不正確';exit;}
		
		$sql="update {$this->prename}members set password=? where uid={$this->user['uid']}";
		if($this->update($sql, md5($npwd))) {echo 'ok';exit;}
		echo '修改密碼失敗';
	}
    
    public final function setCoinPwddo(){
        $opwd=$_POST['oldPwd'];
        if(!$opwd) { echo '原提款密碼不能為空';exit;}
        if(strlen($opwd)<6) { echo '原提款密碼至少6位';exit;}
        if(!$npwd=$_POST['newPwd']) { echo '提款密碼不能為空';exit;}
        if(strlen($npwd)<6) { echo '提領密碼至少6位';exit;}
        
        $sql="select password, coinPassword from {$this->prename}members where uid=?";
        $pwd=$this->getRow($sql, $this->user['uid']);
        if(!$pwd['coinPassword']){
            $npwd=md5($npwd);
            if($npwd==$pwd['password']) { echo '提款密碼與登入密碼不能一樣';exit;}
            $tishi='提款密碼設定成功';
        }else{
            if($opwd && md5($opwd)!=$pwd['coinPassword']) { echo '原提款密碼不正確';exit;}
            $npwd=md5($npwd);
            if($npwd==$pwd['password']) { echo '提款密碼與登入密碼不能一樣';exit;}
        }
        $sql="update {$this->prename}members set coinPassword=? where uid={$this->user['uid']}";
        if($this->update($sql, $npwd)) {echo 'ok';exit;}
        echo '修改提款密碼失敗';
    }
}