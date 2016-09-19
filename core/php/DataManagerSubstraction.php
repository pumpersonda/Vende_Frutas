<?php
/**
 * Created by PhpStorm.
 * User: Andre
 * Date: 12/09/2016
 * Time: 02:44 PM
 */
require_once("FileReader.php");
//
$configFileName = "../../resources/CoupleData.json";

$file = new FileReader($configFileName);
$data = $file->getResource("data");

echo json_encode($data);