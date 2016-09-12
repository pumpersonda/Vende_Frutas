<?php
/**
 * Created by PhpStorm.
 * User: Andre
 * Date: 31/08/2016
 * Time: 12:45 PM
 */
require_once("FileReader.php");
$operation = $_GET["operation"];

$configFileName = "../../resources/CoupleData.json";

$file = new FileReader($configFileName);
try {
    $data = $file->getResource($operation);

    echo json_encode($data);
} catch (Exception $e) {
    printf("Ha ocurrido un error");
}
