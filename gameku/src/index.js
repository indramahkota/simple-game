import Phaser from "phaser";
import gameOptions from "./constants/game-options.js";
import playGame from "./scenes/play-game.js";
import "./assets/styles/style.css";

window.onload = function () {
    //menghilangkan spinner dan containernya
    document.getElementById("spinnercontainer").style.display = "none";
    const ratio = window.innerHeight / window.innerWidth;
    if (ratio >= 1) {
        if (ratio < 1.5) {
            gameOptions.gameWidth = gameOptions.gameHeight / ratio;
        } else {
            gameOptions.gameHeight = gameOptions.gameWidth * ratio;
        }
    } else {
        document.getElementById("wrongorientation").style.display = "block";
        if (navigator.userAgent.indexOf("Win") != -1 ||
            navigator.userAgent.indexOf("Mac") != -1 ||
            navigator.userAgent.indexOf("Linux") != -1) {
            document.getElementById("wrongorientation").style.display = "none";
        }
        //lanscapeRatio = window.innerWidth / window.innerHeight;
        const lanscapeRatio = 1 / ratio;
        if (lanscapeRatio < 1.5) {
            gameOptions.gameWidth = gameOptions.gameHeight / lanscapeRatio;
        } else {
            gameOptions.gameHeight = gameOptions.gameWidth * lanscapeRatio;
        }
    }

    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: gameOptions.gameWidth,
            height: gameOptions.gameHeight
        },
        physics: {
            default: "matter",
            matter: {
                gravity: {
                    y: gameOptions.gravity
                }
            }
        },
        scene: playGame
    }

    new Phaser.Game(gameConfig);
    window.focus();
}