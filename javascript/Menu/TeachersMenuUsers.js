/**
 * Created by Andre on 01/05/2016.
 */

$("#downloadResults").click(function () {

});


function getListUsers(){
    $.ajax({
        url: '../core/php/UserDispatcher.php',
        type: 'get',
        async : false,
        beforeSend: function () {
            $("#tableUsersContent").html("Cargando...");
        },
        success: function (response) {

            showTableUsers(response);
            $("#tableUsersContent").html("");
        },
        error:function(){
            alert("Error en el servidor");
        }
    });
}




function showTableUsers(response){
    try {
        var usersList = JSON.parse(response);

        $("#butonUsers").remove();
        $("#tableUsers").append("<tr>"+
            "<th>"+"Id"+"</th>"+
            "<th>"+"nombre"+"</th>"+
            "<th>"+"contraseña"+"</th>"+
            "<th>"+"Tipo"+"</th>"+
            "<th>"+"Editar"+"</th>"+
            "<th>"+"Eliminar"+"</th>" +
            "</tr>");
        for(var i=0;i<2;i++){

            for(var j=0;j<usersList[i].length;j++){
                var users = usersList[i][j];

                $("#tableUsers").append("<tr>"+
                    "<td contenteditable='true'>"+users.id+"</td>"+
                    "<td contenteditable='true'>"+users.name+"</td>"+"" +
                    "<td contenteditable='true'>"+users.password+"</td>"+"" +
                    "<td contenteditable='true'>"+getUserType(users.type)+"</td>"+"" +
                    "<td>"+"<button class='btn btn-primary' type='button' onclick='editUser(\"#tableUsers\")'>Actualizar</button> "+"</td>"+
                    "<td>"+"<button class='btn btn-primary' type='button' onclick='deleteTableElement(\"#tableUsers\")'>Eliminar</button> "+"</td>"+
                    "</tr>");
            }

        }


    }catch (e){
        console.log(e)
    }
}

function getUserType(numberType) {
    if(numberType==0){
        return "usuario";
    } else{
        return "administrador";
    }
}
function getUserTypeNumber(type){
    var lowerType = type.toLowerCase();
    if(lowerType=="usuario"){
        return 0;
    } else{
        return 1;
    }
}


function addUser() {
    var userName = $("#nameUserText").val();
    var password = $("#passwordUserText").val();
    var type = $("#UserType").val();
    var typeNumber = getUserTypeNumber(type);

    if(userName==null || password==null){
        return;
    }
    var data = {
        username : userName,
        password:password,
        type:typeNumber
    };
    $.ajax({
        url: '../core/php/UserInsert.php',
        data:data,
        type: 'post',
        success: function (response) {
            alertSuccess();
            $("#tableUsers").find("tr").remove();
            getListUsers();
        },
        error:function(){
            alertError();
        }
    });

}

function editUser(table){
    $(table).find("tr").click(function () {
        var id = this.cells[0].innerHTML;
        var userName = this.cells[1].innerHTML;
        var password =  this.cells[2].innerHTML;
        var type = this.cells[3].innerHTML;
        var typeNumber = getUserTypeNumber(type);

        var action = "edit";
        var data = {
            id:id,
            username : userName,
            password:password,
            type:typeNumber
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