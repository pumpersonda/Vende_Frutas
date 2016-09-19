$(document).ready(function () {

    $("#pregunta-correctos").hide();
    $("#puntaje").val("0");
    asignarListenersPregunta();
    $("#nombre-nivel").text("Nivel " + nivel);
    $("#penguin").find("#penguin-img").attr("src", "../img/pin_maestra.png");

    vidas = 3;
    pedirDatos();

});
var vidas;
var cartas = [];
var numParejas = 2;
var nivel = 1;


function pedirDatos() {
    var operation = {"operation": undefined};
    switch (nivel) {
        case 1:
            operation.operation = "sum";
            break;
        case 2:
            operation.operation = "rest";
            break;
        case 3:
            operation.operation = "mul";
            break;
    }
    $.get("../core/php/DataManager.php", operation).done(function (data) {
        if (!data) {
            //No hay datos
            salirJuego();
        }

        var datos = $.parseJSON(data);
        console.log(data);

        if (datos.length < numParejas) {
            //datos incompletos
            salirJuego();
        }
        datos = revolver(datos);
        procesarDatos(datos);
    });
}


function procesarDatos(datos) {
    for (var i = 0; i < numParejas; i++) {
        crearCartas(datos[i].concepto, datos[i].descripcion, i);
    }
    setLife(vidas);
}

function crearCartas(concepto, descipcion, indice) {
    //cargamos la carta y le inyectamos los el concepto
    $.get("../sections/carta.html", function (data) {
        var htmlCarta = $.parseHTML(data);
        $(htmlCarta).attr("id", indice + concepto);
        $(htmlCarta).attr("tipo", "definicion");
        $(htmlCarta).find("#text-card").append(concepto);
        $(htmlCarta).find("#img-correct").hide();
        $(htmlCarta).find("#imagen-carta").attr("src", "../img/fish-bag.png");
        asignarListeners(htmlCarta);
        colocarCartas(htmlCarta);
    });

    //Luego creamos otra carta con la descripcion
    $.get("../sections/carta.html", function (data) {
        var htmlCarta = $.parseHTML(data);
        $(htmlCarta).attr("id", indice + concepto);
        $(htmlCarta).attr("tipo", "concepto");
        $(htmlCarta).find("#text-card").append(descipcion);
        $(htmlCarta).find("#img-correct").hide();
        $(htmlCarta).find("#response-card").show();
        $(htmlCarta).find("#imagen-carta").attr("src", "../img/fish-bag.png");
        asignarListeners(htmlCarta);
        colocarCartas(htmlCarta);
    });
}

var parejaSeleccionada = [];

function asignarListeners(carta) {
    $(carta).click(function () {
        $(carta).toggleClass("flipped");
        //Le quitamos el evento de click
        $(carta).unbind("click");
        parejaSeleccionada.push(carta);


        //Si es la segunda carta seleccionada
        if (parejaSeleccionada.length > 1) {
            bloquearCartas();
            $("#pregunta-correctos").show(500);
        }


    });
}

function confirmarRespuesta(respuesta, caso) {
    var divResultado = $("#resultado");
    divResultado.removeClass();


    $("#pregunta-correctos").hide(500);

    if (respuesta) {
        console.log("Correcto");
        divResultado.text("Correcto");
        divResultado.show(1000);
        divResultado.toggleClass("alert alert-success", true);

    } else {
        console.log("Inorrecto");
        divResultado.text("Incorrecto");
        divResultado.show(1000);
        divResultado.toggleClass("alert alert-danger", true);
    }


    /*
     * Casos:
     * 1-> Respuesta y conceptos iguales: Acertado
     * 2-> Respuesta y conceptos iguales: Fallo
     * 3-> Respuesta y conceptos NO iguales: Fallo
     * 4-> Respuesta y conceptos NO iguales: Acertado
     */

    switch (caso) {
        case 1:
            sumarPuntos(3);
            sacarCartas(parejaSeleccionada);
            break;
        case 2:
            sumarPuntos(-3);
            ocultarSeleccionados();
            deleteLife();
            break;
        case 3:
            sumarPuntos(-3);
            ocultarSeleccionados();
            deleteLife();
            break;
        case 4:
            sumarPuntos(1);
            ocultarSeleccionados();
            break;


    }

    desbloquearCartas();

    if (cartas.length === 0) {
        validateLevel();
    } else if (vidas === 0) {
        validateLevel();
    }

    parejaSeleccionada = [];
}

function ocultarSeleccionados() {
    for (i = 0; i < parejaSeleccionada.length; i++) {
        $(parejaSeleccionada[i]).toggleClass("flipped");
    }
}

function sumarPuntos(puntos) {
    var puntaje = parseInt($("#puntaje").val());
    puntaje = puntaje + puntos;
    $("#puntaje").val(puntaje);
}

function sacarCartas(parejasSeleccionada) {
    for (var i = 0, max = parejasSeleccionada.length; i < max; i++) {
        for (var j = 0; j < cartas.length; j++) {
            var idSeleccionado = $(parejaSeleccionada[i]).attr("id");
            var idCarta = $(cartas[j]).attr("id");
            if (idSeleccionado === idCarta) {
                $(cartas[j]).find("#img-correct").show();
                $(cartas[j]).find("#text-card").hide();
                cartas.splice(j, 1);
                break;
            }
        }
    }

}

function asignarListenersPregunta() {
    $("#respuesta-si").unbind("click");
    $("#respuesta-no").unbind("click");

    $("#respuesta-si").click(function () {
        var id1 = $(parejaSeleccionada[0]).attr("id");
        var id2 = $(parejaSeleccionada[1]).attr("id");


        if (id1 === id2) {
            confirmarRespuesta(true, 1);
        } else {
            confirmarRespuesta(false, 2);
        }


    });

    $("#respuesta-no").click(function () {
        var id1 = $(parejaSeleccionada[0]).attr("id");
        var id2 = $(parejaSeleccionada[1]).attr("id");


        if (id1 === id2) {
            confirmarRespuesta(false, 3);
        } else {
            confirmarRespuesta(true, 4);
        }
    });
}

function colocarCartas(carta) {
    //revolvemos las cartas
    cartas.push(carta);
    cartas = revolver(cartas);
    //Las colocamos en en tablero
    for (i = 0; i < cartas.length; i++) {
        $("#tablero").append(cartas[i]);
    }
}

function bloquearCartas() {
    for (i = 0; i < cartas.length; i++) {
        $(cartas[i]).unbind("click");
    }
}

function desbloquearCartas() {
    for (i = 0; i < cartas.length; i++) {
        asignarListeners(cartas[i]);
    }
}


function validateLevel() {
    var isLevelSuccess = false;
    var isLevelPerfect = false;
    var type = "error";
    var buttonMessage = "Reiniciar";

    if (nivel < 3 && vidas > 0) {
        if (vidas >= 3) {
            isLevelPerfect = true;
        }
        isLevelSuccess = true;
    }

    var message = "Tu puntaje en el juego ha sido de " + $("#puntaje").val() + " puntos";


    if (isLevelSuccess === true) {
        type = "success";
        buttonMessage = "Siguiente";
    }

    showAlertMessage(message, isLevelSuccess, isLevelPerfect, type, buttonMessage);
}


function showAlertMessage(message, isLevelSuccess, isLevelPerfect, type, buttonMessage) {

    swal({
        title: "Nivel terminado",
        text: message,
        type: type,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: buttonMessage,
        cancelButtonText: "Regresar al menu principal",
    }).then(function () {
        if (isLevelSuccess === true) {
            if (isLevelPerfect === true) {
                vidas++;
                showAlertExtraLife();
            }
            nextLevel();

        } else {
            reloadPage();
            pedirDatos();
        }

    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal("Menu", "Menu principal", "info");
        }
    });

}


function showAlertExtraLife() {
    swal({
        title: 'Vida Extra!',
        text: 'Haz ganado una vida extra',
        imageUrl: '../img/heart.png',
        animation: false
    });
}


function nextLevel() {
    nivel++;
    $("#nombre-nivel").text("Nivel " + nivel);
    $("#modal-mensaje").modal('hide');
    deleteOldCards();
    pedirDatos();

}

function reloadPage() {
    location.reload();
}

function deleteOldCards() {
    var a = $("#tablero").find("div").remove();
    console.log(a);
}


function revolver(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function setLife() {
    for (var i = 0; i < vidas; i++) {
        (function (currentImage) {
            var nameId = "lifePoints" + currentImage;
            $("#life").append("<img id=" + nameId + " class='padding-carta'>");
            $("#lifePoints" + currentImage).attr("src", "../img/life.png");
        })(i);
    }
}

function deleteLife() {
    var currentLife = vidas - 1;
    vidas--;
    $("#lifePoints" + currentLife).remove();
}