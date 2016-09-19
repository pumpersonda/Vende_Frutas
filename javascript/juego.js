$(document).ready(function () {


    $("#pregunta-correctos").hide();
    $("#puntaje").val("0");
    asignarListenersPregunta();
    $("#nombre-nivel").text("Nivel " + nivel);

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
        mostrarGanaste();
    } else if (vidas === 0) {
        confirmarPerdiste();
    }


    //divResultado.hide(500);
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


function confirmarPerdiste() {
    mostrarPerdiste();

}


function asignarListenersPregunta() {
    $("#respuesta-si").unbind("click");
    $("#respuesta-no").unbind("click");

    $("#respuesta-si").click(function () {
        var id1 = $(parejaSeleccionada[0]).attr("id");
        var id2 = $(parejaSeleccionada[1]).attr("id");


//        var idF1 = id1.substring(1);
//        var idF2 = id2.substring(1);

        if (id1 === id2) {
            confirmarRespuesta(true, 1);
        } else {
            confirmarRespuesta(false, 2);
        }


    });

    $("#respuesta-no").click(function () {
        var id1 = $(parejaSeleccionada[0]).attr("id");
        var id2 = $(parejaSeleccionada[1]).attr("id");

//        var idF1 = id1.substring(1);
//        var idF2 = id2.substring(1);

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
/*
 var intervaloContador;



 function iniciarContador(tiempo) {
 $("#timer").text(tiempo);
 intervaloContador = setInterval(function () {
 var tiempoDecr = parseInt($("#timer").text());

 tiempoDecr = tiempoDecr - 1;
 if (tiempoDecr === 100) {
 $("#timer").removeClass("buen-tiempo").addClass("poco-tiempo");
 }
 if (tiempoDecr === 0) {
 console.log("Se acabo el tiempo");
 clearInterval(intervaloContador);
 mostrarPerdiste();
 }

 $("#timer").text(tiempoDecr);

 }, 1000);
 }

 */

function mostrarPerdiste() {
    $("#modal-jugar").text("Reiniciar");
    $("#titulo-modal").text("¡Se acabaron las vidas!");
    mostrarModal();
}

function mostrarGanaste() {
    $("#modal-jugar").text("Siguiente Nivel");
    $("#titulo-modal").text("¡Has Ganado!");
    mostrarModal();
}


function mostrarModal() {

    var text = "Tu puntaje en el juego ha sido de " + $("#puntaje").val() + " puntos";

    swal({
        title: "Nivel terminado",
        text: text,
        type: 'success',
        allowOutsideClick:false,
        allowEscapeKey:false,
        showCloseButton: false,
        showCancelButton: true,
        confirmButtonText: "Siguiente Nivel",
        cancelButtonText: "Regresar al menu principal"
    }).then(function () {
        validateNextLevel();
    },function (dismiss) {
        if (dismiss === 'cancel') {
        swal("Menu","Menu principal","info");
        }
    });
}


function validateNextLevel() {
    if (nivel < 3 && vidas <= 0) {
        nivel = 1;
        vidas = 3;
        reloadPage();
        pedirDatos();


    } else if (nivel < 3 && vidas > 0) {
        if (vidas === 3) {
            vidas++;
        }
        nextLevel();
    }
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


/*function enviarDatosPuntaje() {
 //var usuario = $("#nombre-jugador").text();
 var puntaje = $("#puntaje").val();
 $.get("../core/php/IngresarPuntaje.php", {
 idUsuario: idUsuario,
 idMateria: materia,
 dificultad: dificultad,
 puntaje: puntaje,
 parejasEncontradas: 6 - cartas.length / 2
 }).done(function (data) {

 });
 }
 */

function salirJuego() {
    //Aqui ira el menu del juego
    //location.href = "MenuStudent.html";
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