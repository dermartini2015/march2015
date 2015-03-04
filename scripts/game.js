/*
*   Document   : game.js
*
*   Author     : Reichert, Tobias, OFR
*                Rothe, Martin, OFR
*
*   History:
*   2015-02-23  -
*   2015-02-26  TR  Create Main-Game-Engine
*   2015-02-26  MR  Implementaion GUI
*/

function game(){
'use strict';

// Deklaration der Variablen für die Funktion des Hauptmenüs

var anleitung = document.getElementById("anleitungButton");
var buttonsDiv = document.getElementById("buttonsDiv");
var anleitungsDiv = document.getElementById("spielanleitungDiv");
var zuruckButton = document.getElementById("zuruckAnleitungButton");

// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit der Spielanleitung

var hidemenu = function () {
    anleitungsDiv.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
};

// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    anleitung.addEventListener("click", hidemenu);
    zuruckButton.addEventListener("click", hidemenu);

// Funktion bei Klick auf "Spiel starten" um Menü auszublenden, damit ein neues Spiel gestartet werden kann.

    var playGame = document.getElementById("spielstarten");
    var menu = document.getElementById("menu");
    var onlymenubutton = document.getElementById("onlymenubuttondiv");
    var time = document.getElementById("time");
    var ammo = document.getElementById("ammo");
    var score = document.getElementById("score");
    var kugel = document.getElementById("kugel");

    var hidemenufornewgamebig = function (){
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");
        loadGame();
        startGame(1);
    };

    var hidemenufornewgamesmall = function (){
        stopGame();
        saveGame();
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
        ammo.classList.toggle("hidden");
        time.classList.toggle("hidden");
        score.classList.toggle("hidden");
        kugel.classList.toggle("hidden");
    };

    playGame.addEventListener("click", hidemenufornewgamebig);

// Funktion des OnlyMenüButtons, damit das große Menü wieder angezeigt wird

    var onlymenu = document.getElementById("onlymenu");

    var showmenu = function () {
        menu.classList.toggle("hidden");
        onlymenubutton.classList.toggle("hidden");
    };

// Aktionlistener für den kleinen Menübutton oben links, wenn das Hauptmenü ausgeblendet ist
// Auf "Click" wird der Menü Button ausgeblendet und das Hauptmenü eingeblendet

    onlymenu.addEventListener("click", hidemenufornewgamesmall);



// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit der Spieleinstellungen

    var spieleinstellungenButton = document.getElementById("einstellungenButton");
    var spieleinstellungenDiv = document.getElementById("spieleinestellungenDiv");
    var zuruckButtonEinstellungen = document.getElementById("zuruckEinstellungenButton");

var hidemenusettings = function () {
    spieleinstellungenDiv.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
};

// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    spieleinstellungenButton.addEventListener("click", hidemenusettings);
    zuruckButtonEinstellungen.addEventListener("click", hidemenusettings);


    //------------------------------------------------------------------------------------------------------------ //

// Funktion zum Verschwinden lassen des Hauptmenüs und Anzeigen des Divs mit dem Highscore

    var highscoreButton = document.getElementById("highscoreButton");
    var hightscoreDiv = document.getElementById("HighscoreDiv");
    var zuruckButtonHighscore = document.getElementById("zuruckHighscoreButton");

var hidemenuhighscore = function () {
    hightscoreDiv.classList.toggle("hidden");
    buttonsDiv.classList.toggle("hidden");
};

// Eventlistener für den Button "Spielanleitung" und den "Zurück" Button auf dem Spielanleitungs DIV
    highscoreButton.addEventListener("click", hidemenuhighscore);
    zuruckButtonHighscore.addEventListener("click", hidemenuhighscore);



/*
 *
 *  Bereich Engine
 */

// Canvas vorbereiten
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// Listener hinzufügen
canvas.addEventListener("mousedown", mousedownSpielfeld, false);
document.addEventListener('keydown', keydownSpielfeld);

// Variablen vorbereiten
var spielfeld = new createSpielfeld();
var active = true;
var level = null;
var moorhuhn = [];

var timeTimer;
var moveTimer;
var moorhuhnTimer;

/* Dinge für das Spiel (allgemein) */
function loadGame(){

    // Punktestand wird geladen
    spielfeld.score = parseInt(window.localStorage.getItem("GameScore"));
    // Munition wird geladen
    spielfeld.ammo = parseInt(window.localStorage.getItem("GameAmmo"));
    // Spielzeit wird geladen
    spielfeld.time = parseInt(window.localStorage.getItem("GameTime"));

    // Punktestand wird überprüft
    if(isNaN(spielfeld.score) || spielfeld.time<=0){
        spielfeld.score = 0;
    }
    document.getElementById('score').innerHTML = spielfeld.score;

    // Munition wird überprüft
    if(isNaN(spielfeld.ammo) || spielfeld.time<=0){
        spielfeld.ammo = 10;
    }
    document.getElementById('ammo').innerHTML = spielfeld.ammo;

    // Spielzeit wird überprüft
    if(isNaN(spielfeld.time) || spielfeld.time<=0){
        spielfeld.time = 60;
    }
    document.getElementById('time').innerHTML = spielfeld.time;

    // Moorhühner werden geladen
    var i=0;
    var found = 1;

    while(found===1){
        if((window.localStorage.getItem("Moorhuhn"+i)===null)){
            found=0;
        }else{
            addMoorhuhn();
            moorhuhn[i].src = document.getElementById("moorhuhn");
            moorhuhn[i].y = parseInt(window.localStorage.getItem("Moorhuhn"+i+".y"));
            moorhuhn[i].x = parseInt(window.localStorage.getItem("Moorhuhn"+i+".x"));
            moorhuhn[i].hit = window.localStorage.getItem("Moorhuhn"+i+".hit");
            moorhuhn[i].speed = window.localStorage.getItem("Moorhuhn"+i+".speed");
            moorhuhn[i].scale = window.localStorage.getItem("Moorhuhn"+i+".scale");
        }
        i++;
    }
}

function startGame(a){
    // Level wird festgesetzt
    level = a;

    if(spielfeld.time===0){
        window.localStorage.clear();
        moorhuhn = [];
        loadGame();
    }
    timeTimer = setInterval(function(){
        timeSpielfeld();
    }, 1000);

    moveTimer = setInterval(function(){
        moveMoorhuhn();
        drawMoorhuhn();
    }, 10);

    moorhuhnTimer = setInterval(function(){
        addMoorhuhn();
    }, 1000);

    active=true;
}

function stopGame(){
    window.clearInterval(timeTimer);
    window.clearInterval(moveTimer);
    window.clearInterval(moorhuhnTimer);
    active=false;
}

function saveGame(){
    if(spielfeld.time>0){
        window.localStorage.clear();
        window.localStorage.setItem("GameTime", spielfeld.time);
        window.localStorage.setItem("GameScore", spielfeld.score);
        window.localStorage.setItem("GameAmmo", spielfeld.ammo);

        for(var i=0;i<moorhuhn.length;i++){
            window.localStorage.setItem("Moorhuhn"+i, "Moorhuhn"+i);
            window.localStorage.setItem("Moorhuhn"+i+".y", moorhuhn[i].y);
            window.localStorage.setItem("Moorhuhn"+i+".x", moorhuhn[i].x);
            window.localStorage.setItem("Moorhuhn"+i+".hit", moorhuhn[i].hit);
            window.localStorage.setItem("Moorhuhn"+i+".speed", moorhuhn[i].speed);
            window.localStorage.setItem("Moorhuhn"+i+".scale", moorhuhn[i].scale);
        }
    }
    else if(spielfeld.time<=0){
        window.localStorage.clear();
    }
}

/* Dinge für das Spielfeld */

function createSpielfeld(){

    this.time = null;
    this.score = null;
    this.ammo = null;

}

function timeSpielfeld(){
    spielfeld.time --;
    document.getElementById('time').innerHTML = spielfeld.time;

    if(spielfeld.time<=0){
        stopGame();
        onlymenu.click();
    }
}

function keydownSpielfeld(e){
    if(spielfeld.time > 0){
        // Munition mit Strg nachladen
        if (e.keyCode === 17  && active===true){
            spielfeld.ammo = 10;
            document.getElementById('ammo').innerHTML = spielfeld.ammo;
        }

        // Spiel mit Leertaste unterbrechen
        else if (e.keyCode === 32) {
            if(active===true){
                stopGame();
            }else{
                startGame(level);
            }
        }
    }
}

function mousedownSpielfeld(e){

    // Prüfen, ob Munition vorhanden ist
    if(active===true && spielfeld.ammo > 0){

        var mouseX = e.pageX - document.getElementById('game').offsetLeft;
        var mouseY = e.pageY - document.getElementById('game').offsetTop;

        if(spielfeld.time > 0){

            spielfeld.ammo += -1;
            document.getElementById('ammo').innerHTML = spielfeld.ammo;

            // Prüfen, ob Moorhuhn getroffen
            for(var i=0;i<moorhuhn.length;i++){

                if(mouseX > moorhuhn[i].x
                        && mouseX < (moorhuhn[i].x + (70 * moorhuhn[i].scale))
                        && mouseY > moorhuhn[i].y
                        && mouseY < (moorhuhn[i].y + (50 * moorhuhn[i].scale))){


                    if(moorhuhn[i].hit === false){

                        // Punkte werden vergeben
                        if(moorhuhn[i].scale <= 0.6){
                            spielfeld.score += 15;
                            document.getElementById('score').innerHTML = spielfeld.score;
                        }else{
                            if(moorhuhn[i].scale <= 0.8){
                                spielfeld.score += 10;
                                document.getElementById('score').innerHTML = spielfeld.score;
                            }
                            else if(moorhuhn[i].scale > 0.8){
                                spielfeld.score += 5;
                                document.getElementById('score').innerHTML = spielfeld.score;
                            }
                        }
                    }

                    // Trefferstatus wird gesetzt
                    moorhuhn[i].hit = true;
                }
            }
        }
    }
}

/* Dinge für die Moorhühner */

function createMoorhuhn(){
    var min = 0;
    var max = 600;

    this.srcid = 0;
    this.src = document.getElementById("moorhuhn0");
    this.y = Math.floor(Math.random() * (max - min)) + min;
    this.x = 1024;
    this.hit = false;
    this.speed = (parseInt(level) * 2) + 0.5;

    if(level===3){
        this.scale = 0.5;
    }else{
        this.scale = 0.5 + (Math.random() * 0.5);
    }
}

function addMoorhuhn(){
    moorhuhn.push(new createMoorhuhn());
}

function moveMoorhuhn(){
    ctx.clearRect(0,0,1024,768);

    for(var i=0;i<moorhuhn.length;i++){

        // Anzeigebild
        if(moorhuhn[i].srcid === 0){
                moorhuhn[i].src = document.getElementById("moorhuhn0");
                moorhuhn[i].srcid = 1;
        }else{
                moorhuhn[i].src = document.getElementById("moorhuhn1");
                moorhuhn[i].srcid = 0;
        }

        // Bewegungsrichtung
        if(moorhuhn[i].hit === true){
            moorhuhn[i].y += +1;
            if(moorhuhn[i].y > 768){
                window.localStorage.removeItem(moorhuhn[i]);
            }
        }
        else{
            moorhuhn[i].x += - moorhuhn[i].speed;
            if(moorhuhn[i].x<0){
                window.localStorage.removeItem(moorhuhn[i]);
            }

        }
    }
}

function drawMoorhuhn(){
    for(var i=0;i<moorhuhn.length;i++){
        ctx.drawImage(moorhuhn[i].src, moorhuhn[i].x, moorhuhn[i].y, 40 * moorhuhn[i].scale, 50 * moorhuhn[i].scale);
    }
}











};
game();

