$(document).ready(function () {

    $("#pregunta-correctos").hide();
    $("#puntaje").val("0");
    asignarListenersPregunta();

    var tiempo = 150;
    dificultad = "facil";
    materia = 2;

    switch (dificultad) {
        case "facil":
            tiempo = 300;
            break;
        case "medio":
            tiempo = 250;
            break;
        case "dificil":
            tiempo = 5;
            break;
    }

    pedirDatos(materia);
    iniciarContador(tiempo);


});

var dificultad;
var idUsuario;
var materia;
var cartas = [];

function pedirDatos(materia) {
    $.get("../core/php/DataManager.php").done(function (data) {
        if (!data) {
            //No hay datos
            salirJuego();
        }

        var datos = $.parseJSON(data);
        console.log(data);

        if (datos.length < 6) {
            //datos incompletos
            salirJuego();
        }
        datos = revolver(datos);
        procesarDatos(datos);
    });
}


function procesarDatos(datos) {
    for (var i = 0; i < 6; i++) {
        crearCartas(datos[i].concepto, datos[i].descripcion, i);
    }
}

function crearCartas(concepto, descipcion, indice) {
    //cargamos la carta y le inyectamos los el concepto
    $.get("../sections/carta.html", function (data) {
        var htmlCarta = $.parseHTML(data);
        $(htmlCarta).attr("id", indice + concepto);
        $(htmlCarta).attr("tipo", "definicion");
        $(htmlCarta).find("#texto").append(concepto);
        $(htmlCarta).find("#img-correcta").hide();
        $(htmlCarta).find("#imagen-carta").attr("src", "../img/fish-bag.png");
        asignarListeners(htmlCarta);
        colocarCartas(htmlCarta);
    });

    //Luego creamos otra carta con la descripcion
    $.get("../sections/carta.html", function (data) {
        var htmlCarta = $.parseHTML(data);
        $(htmlCarta).attr("id", indice + concepto);
        $(htmlCarta).attr("tipo", "concepto");
        $(htmlCarta).find("#texto").append(descipcion);
        $(htmlCarta).find("#img-correcta").hide();
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
            break;
        case 3:
            sumarPuntos(-3);
            ocultarSeleccionados();
            break;
        case 4:
            sumarPuntos(1);
            ocultarSeleccionados();
            break;
    }

    desbloquearCartas();
    confirmarGane();
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
                $(cartas[j]).find("#img-correcta").show();
                cartas.splice(j, 1);
                break;
            }
        }
    }

}

function confirmarGane() {
    if (cartas.length === 0) {
        clearInterval(intervaloContador);
        mostrarGanaste();
    }
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
            mostrarTiempoTerminado();
        }

        $("#timer").text(tiempoDecr);

    }, 1000);
}

function mostrarTiempoTerminado() {
    $("#titulo-modal").text("¡Se terminó el tiempo!");
    mostrarModal();
}

function mostrarGanaste() {
    $("#titulo-modal").text("¡Has Ganado!");
    mostrarModal();
}

function mostrarModal() {
    //Hacemos que el modal no se pueda cerrar
    $("#modal-jugar").click(function () {
        location.reload();
    });

    $("#modal-regresar").click(function () {
        window.location.href = "../sections/MenuStudent.html";
    });

    var texto = "Tu puntaje en el juego ha sido de " + $("#puntaje").val() + " puntos";
    $("#contenido-modal").text(texto);

    $("#modal-mensaje").modal({
        backdrop: 'static',
        keyboard: false
    });

    enviarDatosPuntaje();

    $("#modal-mensaje").modal('show');
}

function enviarDatosPuntaje() {
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


