<?php 
$pagenum=$_GET['page'];
$pagesize=$_GET['rows'];
$list=$this->getPage("select * from {$this->prename}letter where aId={$this->user['uid']}",$pagenum,$pagesize);

$allarr=array();
$allarr['data']=array();
$allarr['totalCount']=0;
$allarr['otherData']=null;
$listarr=array();

foreach($list['data'] as $v){
	$listarr['id']=$v['id'];
	$listarr['title']=$v['title'];
	$listarr['addDate']=date("Y-m-d H:i",$v['actionTime']);
	$listarr['content']=$v['content'];
	array_push($allarr['data'], $listarr);
}

$allarr['totalCount']=count($allarr['data']);
echo json_encode($allarr);
?>