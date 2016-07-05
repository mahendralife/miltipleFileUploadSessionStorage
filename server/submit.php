<?php
if ($_POST["label"]) {
    $label = $_POST["label"];
}
$total = count($_FILES["file"]["name"]);


$filename=$_FILES["file"]["name"];


$index=0;
foreach ($filename as $value){

 move_uploaded_file($_FILES["file"]["tmp_name"][$index],"upload/" . $value);
 $index++;

}


echo "true";

?>