import mulaiButton from "../assets/sprites/mulai-button.png";

export default class Menu extends Phaser.Scene {
    constructor() {
        //initialize: Phaser.Scene.call(this, { key: 'Menu', active: true, dll... });
        super({ key: 'Menu', active: true });
    }

    preload() {
        this.load.image("mulai_button", mulaiButton);
    }

    create() {
        this.buttonMulai = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "mulai_button");
        this.buttonMulai.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.buttonMulai.scaleX = 0.9;
                this.buttonMulai.scaleY = 0.9;
            })
            .on(Phaser.Input.Events.POINTER_UP, () => {
                this.buttonMulai.scaleX = 1;
                this.buttonMulai.scaleY = 1;

                this.scene.setActive(false, "Menu");
                this.scene.start("PlayGame");
            })
            .on(Phaser.Input.Events.POINTER_OUT, () => {
                this.buttonMulai.scaleX = 1;
                this.buttonMulai.scaleY = 1;
            });
    }
}
