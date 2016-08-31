/**
 * Created by Andre on 01/05/2016.
 */

function getListMatters(){
    $.ajax({
        url: '../core/php/MateriaDispatcher.php',
        type: 'get',
        beforeSend: function () {
            $("#tableMattersContent").html("Cargando...");
        },
        success: function (response) {

            showTableMatters(response);
            $("#tableMattersContent").html("");
        },
        error:function(){
            alert("Error en el servidor");
        }
    });
}

function addMatters() {
    var matter = $("#mattersTxt").val();
    if(matter==null){
        return;
    }
    var data = {
        materia : matter
    };
    $.ajax({
        url: '../core/php/MateriaInsert.php',
        data:data,
        type: 'post',
        success: function (response) {
            alertSuccess();
            $("#tableMatters").find("tr").remove();
            getListMatters();
        },
        error:function(){
            alertError();
        }
    });
}

function showTableMatters(response){
    try {
        var matters = JSON.parse(response);

        $("#buttonMatters").remove();
        $("#tableMatters").append("<tr>"+
            "<th>&emsp;&emsp;&emsp; Id</th>"+
            "<th>&emsp;&emsp;  nombre</th>"+
            "<th>&emsp;&emsp; Editar</th>"+
            "<th>&emsp;&emsp; Eliminar</th>"+
            "<th>&emsp;&emsp; Descargar Puntajes</th>"+
            "</tr>");
        for(var i=0;i<2;i++){

            for(var j=0;j<matters[i].length;j++){

                $("#tableMatters").append("<tr>"+
                    "<td contenteditable='false'>"+matters[i][j].id+"</td>"+
                    "<td contenteditable='true'>"+matters[i][j].name+"</td>"+"" +
                    "<td>"+"<button class='btn btn-primary' type='button' onclick='editMatter(\"#tableMatters\")'>Actualizar</button> "+"</td>"+
                    "<td>"+"<button class='btn btn-primary' type='button' onclick='deleteTableElement(\"#tableMatters\")'>Eliminar</button> "+"</td>"+
                    "<td>"+"<a class='btn btn-primary' type='button' href=../core/php/DownloadScores.php?idMatter="+matters[i][j].id+" >"+
                    " <i class='fa fa-download' aria-hidden='true'></i>"+
                    "</a> "+"</td>"+
                    "</tr>");
            }

        }


    }catch (e){
        console.log(e)
    }
}


function editMatter(table){
    $(table).find("tr").click(function () {
        var id = this.cells[0].innerHTML;
        var matter = this.cells[1].innerHTML;
        var action = "edit";
        var data = {
            id:id,
            materia: matter
        };
        $.ajax({
            url: getUrlServer(table,action),
            data:data,
            type: 'post',
            success: function () {
                alertSuccess();
            },
            error:function(){
                alertError();
            }
        });

    });
}

function downloadScore(table){
    $(table).find("tr").click(function () {
        var id = this.cells[0].innerHTML;
        var data= {
            idMatter:id
        };
        $.ajax({
            url: '../core/php/DownloadScores.php',
            data:data,
            type: 'post',
            success: function (response) {
                console.log(response);
                alertSuccess()

            },
            error:function(){
                alertError()
            }
        });
    });
}