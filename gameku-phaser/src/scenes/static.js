import gameOptions from "../utilities/game-options.js";
import sky from "../assets/sprites/sky.png";

export default class Static extends Phaser.Scene {
    constructor() {
        //initialize scene
        //Phaser.Scene.call(this, { key: 'Static', active: true, dll... });
        super({ key: 'Static', active: true });
    }

    preload() {
        this.load.image("sky", sky);
    }

    create() {
        this.sky = this.add.image(0, 0, "sky");
        this.sky.setDisplaySize(gameOptions.gameWidth, gameOptions.gameHeight);
        this.sky.setOrigin(0, 0);
    }
}
