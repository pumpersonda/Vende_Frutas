<?php
/**
 * Created by PhpStorm.
 * User: Andre
 * Date: 31/08/2016
 * Time: 12:45 PM
 */
require_once("FileReader.php");
$configFileName = "../../resources/CoupleData.json";

$file = new FileReader($configFileName);
$data = $file->getResource("data");

echo json_encode($data);