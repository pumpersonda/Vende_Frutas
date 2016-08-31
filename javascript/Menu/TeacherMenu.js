/**
 * Created by Andre on 16/04/2016.
 */


$(function() {


    $('.active').click(function () {

        showModule(this.id)
    });

});


function showModule(id){
    var module = getModule(id);

    var locationToInsert = $("#content");
    cleanWindow();
    if(module=="../resources/ContentOfConceptsTeacher.html"){
        loadMatters();

    }
    insertContentToPage(module,locationToInsert);

}

function getModule(idButton){
    var view;
    switch (idButton){
        case "concepts":
            view = "../resources/ContentOfConceptsTeacher.html";
            break;
        case "users":
            view = "../resources/ContentOfUsersTeacher.html";
            break;
        case "matters":
            view = "../resources/ContentOfMattersTeacher.html";
            break;
        default:
            view = null;
            break;
    }
    return view;
}

function cleanWindow(){
    //Es el container de la ventana
    container.innerHTML = "";
}


/*
 Esta funcion determina en base a la tabla en la que fue presionado el boton
 cual es el url que devolvera
 */
function getUrlServer(request,action){
    if(request=="#tableMatters" && action=="delete"){
        return '../core/php/DeleteMateria.php';
    } else if(request=="#tableUsers" && action == "delete"){
        return '../core/php/DeleteUser.php';
    } else if(request=="#tableMatters" && action=="edit"){
        return '../core/php/MateriaUpdate.php';
    } else if(request=="#tableUsers" && action == "edit"){
        return '../core/php/UserUpdate.php';
    } else if (request=="#tableConcepts" && action=="delete"){
        return '../core/php/DeleteCouple.php';
    } else if(request=="#tableConcepts" && action=="edit"){
        return '../core/php/UpdateCouple.php';
    }
}

function getDataTable(tableName){
    $(tableName).find("tr").remove();

    switch (tableName){
        case "#tableMatters":
            getListMatters();
            break;
        case "#tableUsers":
            getListUsers();
            break;
        case "#tableConcepts":
            getListCouples();
            break;
    }
}

/*
 En esta funcion se le manda el id de la tabla desde donde fue presionada para saber de que tabla es de donde
 obtendra el id y saber cual se eliminara
 */
function deleteTableElement(table){
    $(table).find("tr").click(function () {

        var id = this.cells[0].innerHTML;
        //Esta variable nada mas se usa la seccion de Parejas
        var idMatterName = this.cells[1].innerHTML;
        if(table == "#tableConcepts"){
            var idMatter = getMatterById(idMatterName);
        }

        var action = "delete";
        var data = {
            id:id,
            idMatter:idMatter
        };
        $.ajax({
            url: getUrlServer(table,action),
            data:data,
            type: 'post',
            success: function () {
                alertSuccess();
                getDataTable(table);

            },
            error:function(){
                alertError();
            }
        });

    });
}

function alertSuccess(){
    var module = "../resources/success.html";
    var locationToInsert = $("#divStatus");
    insertContentToPage(module,locationToInsert);
}

function alertError() {
    var module = "../resources/success.html";
    var locationToInsert = $("#divStatus");
    insertContentToPage(module,locationToInsert);
}


