<?php
function addFileToZip($path,$zip){
    $handler=opendir($path);
    while(($filename=readdir($handler))!==false){
        if($filename != "." && $filename != ".."){
            if(is_dir($path."/".$filename)){
                addFileToZip($path."/".$filename, $zip);
            }else{
                $zip->addFile($path."/".$filename);
            }
        }
    }
    @closedir($path);
}


$zip=new ZipArchive();
if($zip->open('m.zip', ZipArchive::OVERWRITE)=== TRUE){
    addFileToZip('D:/admin/m', $zip);
    $zip->close();
}
?>