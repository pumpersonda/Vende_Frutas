$(document).ready(function () {

    var currentTime= 0; //modificado alex
    var audio = document.getElementById('sound');
    var audio_good = document.getElementById('good');
    var audio_wrong = document.getElementById('wrong');

    $("#pregunta-correctos").hide();
    asignarListenersPregunta();
    $("#nombre-nivel").text("Nivel " + nivel);


    vidas = 3;
    pedirDatos();


    audio.currentTime = currentTime; // modificado alex INICIO

    audio.onended = function(){
        audio.currentTime= 44;
        audio.play();
    };

    audio_wrong.onended = function(){
        audio.play();
    };


    audio_good.onended = function(){
        audio.play();
    }

});

var vidas;
var cartas = [];
var numParejas = 6;
var nivel = 1;
var initTime = 100;

/*******************ALEX*************
$('.volumeon').click(function (e){
    e.preventDefault();
    $('.volumeon').removeClass('visible');
    $('.mute').removeClass('hidden');
    $('.mute').addClass('visible');
    $('.volumeon').addClass('hidden');
    song.volume=0;

})

$('.mute').click(function (e){
    e.preventDefault();
    $('.volumeon').removeClass('hidden');
    $('.mute').removeClass('visible');
    $('.mute').addClass('hidden');
    $('.volumeon').addClass('visible');
    song.volume=1;

})
******************************************/


function pedirDatos() {
    if(nivel===3){
        showGameOver();
    }else{
        var operation = {"level": undefined};
        switch (nivel) {
            case 1:
            $("html").addClass("nivel1");
            operation.level = "level1";
            break;
            case 2:
            $("html").addClass("nivel2");
            operation.level = "level2";


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

        iniciarContador(initTime);
    }
}


function procesarDatos(datos) {
    for (var i = 0; i < numParejas; i++) {
        crearCartas(datos[i].concepto, datos[i].descripcion, i);
    }
    setLife(vidas);
}

//Lugar donde hay que verificar como se crean

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
        $(htmlCarta).find("#text-card").append("<img id=" + concepto + " src='../img/fruits/" + descipcion + "' class='fruits-image'>");
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

var intervaloContador;

function iniciarContador(time) {
 $("#timer").removeClass("poco-tiempo").addClass("buen-tiempo");
 $("#timer").text(time);
 intervaloContador = setInterval(function () {
    var tiempoDecr = parseInt($("#timer").text());

    tiempoDecr = tiempoDecr - 1;

    if (tiempoDecr === 30) {
        $("#timer").removeClass("buen-tiempo").addClass("poco-tiempo");
    }
    if (tiempoDecr === 0) {
        clearInterval(intervaloContador);
        deleteLife();
        reloadTimer();
        return;
    }

    $('#timer').text(tiempoDecr);

}, 1000);
}

function stopTime() {
    clearInterval(intervaloContador)
}
function reloadTimer() {
    if (vidas === 0) {
        validateLevel();
    }else{
        iniciarContador(initTime);
    }
}

/*************Copiar y pegar este *************/
function confirmarRespuesta(respuesta, caso) {
    var corResultado = $("#correct_answer");
    var wrongResultado = $("#wrong_answer");
    var audio = document.getElementById('sound'); /*Modifico alex*/
    var audio_wrong = document.getElementById('wrong'); /*Modifico Alex*/
    var audio_good = document.getElementById('good');/*Alex modifico*/



    $("#pregunta-correctos").hide(500);

    if (respuesta) {

        //console.log("Correcto");
        //audio.pause();
        audio_good.play();/*Alex modifico */
        corResultado.css("background-color", "lightgreen");
        corResultado.fadeToggle(100);
        corResultado.fadeToggle(3000);
    } else {

        //audio.pause();
        audio_wrong.play();/*Alex modifico */

        wrongResultado.css("background-color", "#F6CECE");
        wrongResultado.fadeToggle(2000);
        wrongResultado.fadeToggle(4000);
    }

/*****************************************************/
    /*
     * Casos:
     * 1-> Respuesta y conceptos iguales: Acertado
     * 2-> Respuesta y conceptos iguales: Fallo
     * 3-> Respuesta y conceptos NO iguales: Fallo
     * 4-> Respuesta y conceptos NO iguales: Acertado
     */

     switch (caso) {
        case 1:
        sacarCartas(parejaSeleccionada);
        break;
        case 2:
        ocultarSeleccionados();
        deleteLife();
        break;
        case 3:
        ocultarSeleccionados();
        deleteLife();
        break;
        case 4:
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
/********************************/



function ocultarSeleccionados() {
    for (i = 0; i < parejaSeleccionada.length; i++) {
        $(parejaSeleccionada[i]).toggleClass("flipped");
    }
}

/*function sumarPuntos(puntos) {
 var puntaje = parseInt($("#puntaje").val());
 puntaje = puntaje + puntos;
 $("#puntaje").val(puntaje);
}*/

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
        stopTime();
    }

    var message = "";


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
        showCloseButton: false,
        showCancelButton: true,
        confirmButtonText: buttonMessage,
        cancelButtonText: "Regresar al menu principal"
    }).then(function () {
        if (isLevelSuccess === true) {
            if (isLevelPerfect === true) {
                vidas++;
                showAlertExtraLife();
            }
            nextLevel();

        } else {
            stopTime();
            pedirDatos();
            reloadPage();
        }

    }, function (dismiss) {
        if (dismiss === 'cancel') {
            location.href = './menu.html';
        }
    });

}

//Cuando pierdes y le das reiniciar
function reloadPage() {
    location.reload();
}

function showAlertExtraLife() {
    swal({
        title: 'Vida Extra!',
        text: 'Haz ganado una vida extra',
        imageUrl: '../img/heart.png',
        animation: false
    });
}

function showGameOver(){
    swal({
        title: 'Game Over',
        text: 'Felicidades!! Terminaste el juego',
        imageUrl: '../img/trophy.png',
        animation: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        showCloseButton: false,
        showCancelButton: true,
        confirmButtonText: "Reiniciar",
        cancelButtonText: "Regresar al menu principal"
    }).then(function () {

        stopTime();
        pedirDatos();
        reloadPage();


    }, function (dismiss) {
        if (dismiss === 'cancel') {
            location.href = './menu.html';
        }
    });
}


function nextLevel() {
    nivel++;
    $("#nombre-nivel").text("Nivel " + nivel);
    $("#modal-mensaje").modal('hide');
    deleteOldCards();
    pedirDatos();

}


function deleteOldCards() {
    $("#tablero").find("div").remove();
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
            $("#life").append("<img id=" + nameId + " class='padding-life'>");
            $("#lifePoints" + currentImage).attr("src", "../img/life.png");
        })(i);
    }
}

function deleteLife() {
    var currentLife = vidas - 1;
    vidas--;
    $("#lifePoints" + currentLife).remove();
}
