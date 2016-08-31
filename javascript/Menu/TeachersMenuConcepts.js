/**
 * Created by Andre on 01/05/2016.
 */

function getListCouples(){
    $.ajax({
        url: '../core/php/ParejasDispatcher.php',
        type: 'get',
        beforeSend: function () {
            $("#tableConceptsContent").html("Cargando...");
        },
        success: function (response) {

            showTableConcepts(response);

        },
        error:function(){
            alert("Error en el servidor");
        }
    });
}
function addCouple (){

    var concept = $("#ConceptTxt").val();
    var definition = $("#definitionTxt").val();
    var matter = $("#mattersList").val();

    if(concept==null || definition== null || matter=="none"){
        alert("Rellene todos los campos");
        return;
    }

    var data = {
        idMatter:matter,
        concept:concept,
        definition:definition
    };


    $.ajax({
        url: '../core/php/ParejasInsert.php',
        data:data,
        type: 'get',
        success: function (response) {
            alertSuccess();
            $("#tableConcepts").find("tr").remove();
            getListCouples();
        },
        error:function(){
            alertError();
        }
    });

}


function loadMatters() {

    $.ajax({
        url: '../core/php/MateriaDispatcher.php',
        type: 'get',
        success: function (response) {

            addMattersToList(response);
        },
        error:function(){
            alert("Error en el servidor");
        }
    });

}

function addMattersToList(response) {
    var mattersList = JSON.parse(response);
    for(var i=0;i<2;i++){

        for(var j=0;j<mattersList[i].length;j++){
            $("#mattersList").append(" <option  value="+mattersList[i][j].id+">"+mattersList[i][j].name+"</option>");
        }

    }

}


function showTableConcepts(response){
    try {
        var couples = JSON.parse(response);

        $("#buttonConcepts").remove();
        for(var i=0;i<2;i++){

            for(var j=0;j<couples[i].length;j++){

                $("#tableConcepts").append("<tr>"+
                    "<td contenteditable='false'>"+couples[i][j].id+"</td>"+
                    "<td contenteditable='true'>"+getMatterById(couples[i][j].idMatter)+"</td>"+
                    "<td contenteditable='true'>"+couples[i][j].concept+"</td>"+
                    "<td contenteditable='true'>"+couples[i][j].definition+"</td>"+"" +
                    "<td>"+"<button class='btn btn-primary' type='button' onclick='editCouple(\"#tableConcepts\")'>Actualizar</button> "+"</td>"+
                    "<td>"+"<button class='btn btn-primary' type='button' onclick='deleteTableElement(\"#tableConcepts\")'>Eliminar</button> "+"</td>"+
                    "</tr>");
            }

        }


    }catch (e){
        console.log(e)
    }
}

function getMatterById(idMatter) {
    var array = setMatterWithId();
    return array[idMatter];

}

function setMatterWithId(){
    var mattersList = document.getElementById("mattersList");
    var array = [];

    for(var i=0;i<mattersList.length;i++){
        array[mattersList.options[i].value]=mattersList.options[i].text;
        array[mattersList.options[i].text]=mattersList.options[i].value;
    }

    return array;
}


function editCouple(table){
    $(table).find("tr").click(function () {
        var id = this.cells[0].innerHTML;
        var idMatterName = this.cells[1].innerHTML;
        var idMatter = getMatterById(idMatterName);
        var concept = this.cells[2].innerHTML;
        var definition = this.cells[3].innerHTML;
        var action = "edit";

        var data = {
            id:id,
            idMatter: idMatter,
            concept:concept,
            definition:definition
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