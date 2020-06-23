import Phaser from "phaser";
import gameOptions from "./constants/game-options.js";
import playGame from "./scenes/play-game.js";
import "./assets/styles/style.css";

import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

window.onload = function () {
    const ratio = window.innerHeight / window.innerWidth;
    if (ratio >= 1) {
        if (ratio < 1.5) {
            gameOptions.gameWidth = gameOptions.gameHeight / ratio;
        } else {
            gameOptions.gameHeight = gameOptions.gameWidth * ratio;
        }
    } else {
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
        plugins: {
            scene: [{
                    key: 'rexUI',
                    plugin: UIPlugin,
                    mapping: 'rexUI'
                }
            ]
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