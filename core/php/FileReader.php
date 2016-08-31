<?php
/**
 * Created by IntelliJ IDEA.
 * User: jonathaneduardo
 * Date: 09/05/2016
 * Time: 11:24 PM
 */

class FileReader{
    private $file;
    private $fileContent;
    private $fileLength;

    public function __construct($fileName){
        $this->file = fopen($fileName,"r") or die ("No se puede abrir el archivo");
        $this->fileLength = filesize($fileName);
        $this->fileContent = json_decode(fread($this->file,$this->fileLength),true);
    }

    public function getResource($resourceName){
        return $this->fileContent[$resourceName];
    }

    public function __destruct(){
        fclose($this->file);
    }

}