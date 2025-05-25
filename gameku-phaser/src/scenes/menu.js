import mulaiButton from "../assets/sprites/mulai-button.png";

export default class Menu extends Phaser.Scene {
  constructor() {
    //initialize scene
    //Phaser.Scene.call(this, { key: 'Menu', active: true, dll... });
    super({ key: "Menu", active: true });
  }

  preload() {
    this.load.image("mulai_button", mulaiButton);
  }

  create() {
    this.buttonMulai = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "mulai_button"
    );
    this.buttonMulai
      .setDisplaySize(255, 60)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.buttonMulai.setDisplaySize(0.9 * 255, 0.9 * 60);
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.buttonMulai.setDisplaySize(255, 60);

        this.scene.setActive(false, "Menu");
        this.scene.start("PlayGame");
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.buttonMulai.setDisplaySize(255, 60);
      });
  }
}
