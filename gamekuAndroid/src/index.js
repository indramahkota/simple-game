import "./index.css";
import gameOptions from "./utilities/game-options.js";

import Phaser from "phaser";
import Static from "./scenes/static.js";
import Menu from "./scenes/menu.js";
import PlayGame from "./scenes/game.js";

window.onload = function () {
  const setGameSize = (ratio) => {
    if (ratio < 1.5) {
      gameOptions.gameWidth = gameOptions.gameHeight / ratio;
    } else {
      gameOptions.gameHeight = gameOptions.gameWidth * ratio;
    }
  };

  if ((window.innerHeight / window.innerWidth) >= 1) {
    setGameSize(window.innerHeight / window.innerWidth);
  } else {
    setGameSize(window.innerWidth / window.innerHeight);
  }

  let gameConfig = {
    type: Phaser.WEBGL,
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
          y: gameOptions.gravity,
        }
      }
    },
    audio: {
      noAudio: true,
      disableWebAudio: true,
    },
    scene: [Static, Menu, PlayGame]
  };

  new Phaser.Game(gameConfig);
  window.focus();
};
