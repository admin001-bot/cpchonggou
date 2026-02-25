<?php

/**
*  UPDATE 2016-05 DAVID 站内信
*/
class Letter extends WebLoginBase{
	public $pageSize=15;
	

	//站内信主页
	public final function main(){
		$this->display('safe/letter-main.php');
	}
	
	//站内信搜索列表
	public final function searchLetter(){
		$this->display('safe/letter-search-list.php');
	}
	
	//站内信详细页面
	public final function letterInfo($id){
		$this->display('safe/letter-Info.php',0,intval($id));
	}
	
	//站内信页面
	public final function addLetterMain(){
		$this->display('safe/addLetter-Main.php');
	}
	
	//站内信编写
	public final function addLetter(){
		if(!$_POST['user']) throw new Exception('請選擇需要傳送的物件：上級代理/下級會員！');
		if(!$_POST['title']) throw new Exception('請輸入需要傳送的訊息主題！');
		if(!$_POST['content']) throw new Exception('請輸入需要傳送的訊息內容！');
		if(strlen($_POST['title'])==300) throw new Exception('系統偵測資訊主題過長，請縮短至120字以內！'); 
		if(strlen($_POST['content'])==700) throw new Exception('系統偵測訊息內容過長，請縮短至300字以內！'); 
		$letter['aId']=intval($_POST['user']);
		$letter['sId']=$this->user['uid'];
		$letter['title']=$_POST['title'];
		$letter['content']=$_POST['content'];
		$letter['actionTime']=$this->time;
		try{
		  $this->insertRow($this->prename .'letter', $letter);
		}catch(Exception $e){
		  throw new Exception("訊息發送失敗！請聯絡線上客服處理！");
		}
		  return "訊息發送成功！";
	}
	
}