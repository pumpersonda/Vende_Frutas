/**
 * Created by Andre on 12/03/2016.
 */


/*
Agrega mas elementos al div, es usado para insertar contenido de la pagina como botones, div, tablas
 */
function insertContentToPage(module, location) {

    $.get(module,function(data){

        location.html(data);

    });
}

