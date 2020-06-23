import gameOptions from "../constants/game-options.js";
//import utilities from "../constants/android-utilities.js";

/* Load Assets with file-loader */
//Font Assets
import normalFont from "../assets/fonts/font.fnt";
import smallFont from "../assets/fonts/smallfont.fnt";
import normalFontImg from "../assets/fonts/font.png";
import smallFontImg from "../assets/fonts/smallfont.png";

//Image Assets
import ground from "../assets/sprites/ground.png";
import sky from "../assets/sprites/sky.png";
import book from "../assets/sprites/book.png";
import bookFrame from "../assets/sprites/book-frame.png";

//Sound Assets
// import backSoundMp from "../assets/sounds/backsound.mp3";
// import backSoundOg from "../assets/sounds/backsound.ogg";
// import gameOverMp from "../assets/sounds/gameover.mp3";
// import gameOverOg from "../assets/sounds/gameover.ogg";

import hit1Mp from "../assets/sounds/hit01.mp3";
import hit1Og from "../assets/sounds/hit01.ogg";
import hit2Mp from "../assets/sounds/hit02.mp3";
import hit2Og from "../assets/sounds/hit02.ogg";
import hit3Mp from "../assets/sounds/hit03.mp3";
import hit3Og from "../assets/sounds/hit03.ogg";
import removeMp from "../assets/sounds/remove.mp3";
import removeOg from "../assets/sounds/remove.ogg";

export default class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    preload() {
        //load image assets
        this.load.image("ground", ground);
        this.load.image("sky", sky);
        this.load.image("book", book);
        this.load.image("book_frame", bookFrame);
        //load font assets
        this.load.bitmapFont("font", normalFontImg, normalFont);
        this.load.bitmapFont("smallfont", smallFontImg, smallFont);
        //load audio assets
        this.load.audio("hit01", [hit1Og, hit1Mp]);
        this.load.audio("hit02", [hit2Og, hit2Mp]);
        this.load.audio("hit03", [hit3Og, hit3Mp]);
        this.load.audio("remove", [removeOg, removeMp]);
        // this.load.audio("gameover", [gameOverOg, gameOverMp]);
        // this.load.audio("backsound", [backSoundOg, backSoundMp]);
    }

    create() {
        //utilities.showAndroidToast("Hello World!");
        //utilities.showAndroidPopUp();

        // mendapatkan definisi texture
        this.GROUNDWIDTH = this.textures.get('ground').getSourceImage().width;
        this.GROUNDHEIGHT = this.textures.get('ground').getSourceImage().height;
        this.BOOKWIDTH = this.textures.get('book').getSourceImage().width;
        this.BOOKHEIGHT = this.textures.get('book').getSourceImage().height;

        //Fixed Update time step is 30hz (0.033s), physics operations occur once every 0.033 seconds.
        /* By default, physics operations occur once every 0.02 seconds, or 50hz.
            Each FixedUpdate call is bound to the physics engine,
            and a change of the physics timescale will result in a change of the speed of the FixedUpdate. */
        
        this.matter.world.update30Hz();
        this.canDrop = true;
        this.timer = 0;
        
        //this.maxHeightTest = 0;
        
        this.timerEvent = null;
        this.addSky();
        this.addGround();
        this.addMovingBook();
        this.score = 0;
        this.lastSoundPlayed = 0;
        this.savedData = localStorage.getItem(gameOptions.localStorageName) == null ? { score: 0 } : JSON.parse(localStorage.getItem(gameOptions.localStorageName));
        this.hitSound = [this.sound.add("hit01"), this.sound.add("hit02"), this.sound.add("hit03")];
        this.timeText = this.add.bitmapText(10, 10, "font", gameOptions.timeLimit.toString(), 72);
        this.bookGroup = this.add.group();
        this.matter.world.on("collisionstart", this.checkCollision, this);
        this.setCameras();
        this.input.on("pointerdown", this.dropBook, this);
        this.removeBookSound = this.sound.add("remove", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        // this.backgroundMusic = this.sound.add("backsound", {
        //     mute: false,
        //     volume: 0.7,
        //     rate: 1,
        //     detune: 0,
        //     seek: 0,
        //     loop: true,
        //     delay: 0
        // });
        // this.backgroundMusic.play();

        this.scoreText = this.add.bitmapText(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "smallfont", "Skor: 0", 32);
        this.scoreText.x = (this.sys.game.config.width - this.scoreText.width) / 2;
        this.scoreText.y = (this.sys.game.config.height - this.scoreText.height) / 2;
        this.scoreText.visible = false;
        this.actionCamera.ignore(this.scoreText);

        this.highscoreText = this.add.bitmapText(this.sys.game.config.width, 10, "smallfont", "Skor Tertinggi: " + this.savedData.score, 32);
        this.highscoreText.x = this.highscoreText.x - this.highscoreText.width - 10;
        this.actionCamera.ignore(this.highscoreText);
    }

    addSky() {
        //menambahkan background sky dengan posisi default = (0,0) dan,
        //titik acuan posisinya di tengah gambar
        this.sky = this.add.image(0, 0, "sky");
        //mengubah ukuran sky agar mengcover layar full screen
        this.sky.setDisplaySize(gameOptions.gameWidth, gameOptions.gameHeight);
        //mengubah posisi sky menjadi tengah-tengah screen
        //opsi: this.sky.setPosition(this.cameras.main. {centerX ,| centerY})
        //opsi: this.sky.setPosition(gameOptions.gameWidth / 2, gameOptions.gameHeight / 2);
        this.sky.setOrigin(0, 0);
    }

    addGround() {
        this.ground = this.matter.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height, "ground");
        this.ground.setBody({
            type: "rectangle",
            width: this.ground.displayWidth,
            height: this.ground.displayHeight * 2
        });
        //setOrigin -> pusat gambarnya : horizontal=tengah, vertical=bawah
        this.ground.setOrigin(0.5, 1);
        //setStatic -> gambar ini tidak terpengaruh oleh gravitasi
        this.ground.setStatic(true);
    }

    addMovingBook() {
        //menempatkan buku di sebelah kanan dan menganimasikannya
        //menuju kearah kiri sampai ke posisi BOOKWIDTH
        this.movingBook = this.add.sprite(this.sys.game.config.width - this.BOOKWIDTH, this.BOOKWIDTH, "book");
        //this.movingBook = this.add.sprite(this.sys.game.config.width / 2, this.BOOKWIDTH, "book");
        this.tweens.add({
            targets: this.movingBook,
            x: this.BOOKWIDTH,
            duration: gameOptions.bookSpeed,
            yoyo: true,
            repeat: -1
        });
    }

    checkCollision(e, b1, b2) {
        //jika collision dimulai akan me-return 2 objek body1 dan body2
        //body1 dan body2 kita nyatakan sudah ber collision
        if (b1.isBook && !b1.hit) {
            b1.hit = true;
            //jika bukunya sudah bertumbukkan, maka kita bisa menjatuhkannya lagi
            this.nextBook();
        }
        if (b2.isBook && !b2.hit) {
            b2.hit = true;
            this.nextBook();
        }

        //Phaser.Math.RND.pick(this.hitSound).play();
        //var delay = new Date().getMilliseconds() - this.lastSoundPlayed;
        //agar suara tidak terlalu cepat saat dimainkan
        var delay = Date.now() - this.lastSoundPlayed;
        if (delay > 200 && this.timer <= gameOptions.timeLimit) {
            this.lastSoundPlayed = Date.now();
            Phaser.Math.RND.pick(this.hitSound).play();
        }
    }

    setCameras() {
        this.actionCamera = this.cameras.add(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        //meng-ignore objek sky
        //this.actionCamera.ignore([this.sky]);
        this.actionCamera.ignore([this.sky, this.timeText]);
        this.cameras.main.ignore([this.ground, this.movingBook]);
    }

    dropBook() {
        //fungsi yang di invoke saat pointerdown dan akan menjatuhkan buku ketika canDrop=true
        this.input.stopPropagation();
        if (this.canDrop && this.timer < gameOptions.timeLimit) {
            this.addTimer();
            this.canDrop = false;
            this.movingBook.visible = false;
            this.addFallingBook();
        }
    }

    update() {
        this.bookGroup.getChildren().forEach(function (book) {
            if (book.y > this.sys.game.config.height + book.displayHeight) {
                //ketika objek hit bernilai salah (tidak bertumbukkan)
                //maka kita bisa menjatuhkan buku kembali
                if (!book.body.hit) {
                    this.nextBook();
                }
                //dan jika memenuhi persyaratan y-nya lebih besar dari tinggi screen
                //kita akan menghapus objek buku nya
                book.destroy();
            }
        }, this);
    }

    addTimer() {
        //addTimer hanya dijalankan 1 kali saja
        //saat buku pertama dijatuhkan
        //dengan waktu delay 1 detik
        //setelah 1 detik akan memanggil caallback tick()
        if (this.timerEvent == null) {
            this.timerEvent = this.time.addEvent({
                delay: 1000,
                callback: this.tick,
                callbackScope: this,
                loop: true
            });
        }
    }

    addFallingBook() {
        let fallingBook = this.matter.add.sprite(this.movingBook.x, this.movingBook.y, "book");
        fallingBook.setMass(2);
        fallingBook.setFrictionStatic(10);
        fallingBook.body.isBook = true;
        fallingBook.body.hit = false;
        this.bookGroup.add(fallingBook);
        this.cameras.main.ignore(fallingBook);
    }

    nextBook() {
        this.zoomCamera();
        this.canDrop = true;
        this.movingBook.visible = true;
    }

    zoomCamera() {
        //untuk menentukan setinggi apa buku-nya bertumpuk
        let maxHeight = 0;
        //mengecek semua buku yang ada di bookGroup
        this.bookGroup.getChildren().forEach(function (book) {
            //jika buku tersebut sudah bertumbukkan
            if (book.body.hit) {
                //memasukkan nilai maxHeight yaitu nilai yang terbesar diantara 2 nilai yang diberikan
                maxHeight = Math.max(maxHeight,
                    Math.round((this.ground.getBounds().top - book.getBounds().top) / book.displayHeight)
                );
            }
        }, this);

        this.movingBook.y = this.ground.getBounds().top - maxHeight * this.movingBook.displayHeight - gameOptions.bookHeight;
        let zoomFactor = gameOptions.bookHeight / (this.ground.getBounds().top - this.movingBook.y);

        this.actionCamera.zoomTo(zoomFactor, 500);
        let newHeight = this.sys.game.config.height / zoomFactor;
        this.actionCamera.pan(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - (newHeight - this.sys.game.config.height) / 2, 500);
    }

    tick() {
        //setiap 1 detik, akan menambahkan nilai timer sebanyak 1
        //ini untuk menampilkan teks waktu mundur
        if (!this.paused) {
            this.timer++;
            this.timeText.text = (gameOptions.timeLimit - this.timer).toString();
        }
        //console.log(this.timeText.text);
        //console.log(this.backgroundMusic.mute);

        //jika waktu habis, maka akan memanggil fungsi game selesai
        if (this.timer >= gameOptions.timeLimit) {
            //menghapus timer event dari phaser
            this.timerEvent.remove();
            //menghapus movingBook
            this.movingBook.destroy();

            //menambahkan timer event baru selama 2 detik (time out/durasi)
            //membuat timer event baru secara loop dan callback fungsi untuk menghapus buku
            //sampai buku dalam bookGroup habis, timer baru tersebut akan di hapus
            this.time.addEvent({
                delay: 3000,
                callback: function () {
                    this.matter.world.destroy();

                    this.bookGroup.getChildren().forEach(function (book) {
                        if (book.body.hit) {
                            //rumus menghitung tumpukkan bukunya berdasarkan tinggi buku,
                            //misal: posisi ground = 300, posisi buku berdasarkan tinggi buku = 99,
                            //rumus tumpukan pertama = (300 - (300 - 99)) / 99 = 99/99 = 1. dst untuk tumpukkan atasnya
                            book.sign = Math.round((this.ground.getBounds().top - book.getBounds().top) / book.displayHeight);
                        }
                    }, this);

                    /* this.bookGroup.getChildren().sort(function(a , b) {
                        return a.sign - b.sign;
                    }); */

                    this.bookGroup.getChildren().sort(function (a, b) {
                        if (a.sign === b.sign) {
                            return a.x - b.x;
                        } else {
                            return a.sign - b.sign;
                        }
                    });
                    this.bookGroup.getChildren().reverse();

                    this.scoreText.visible = true;

                    /* this.bookGroup.getChildren().sort(function(a , b) {
                        return a.x - b.x;
                    }); */

                    this.removeEvent = this.time.addEvent({
                        delay: 500,
                        callback: this.destroyBook,
                        callbackScope: this,
                        loop: true
                    })
                },
                callbackScope: this
            });
        }
    }

    destroyBook() {
        if (this.bookGroup.getChildren().length > 0) {
            //this.bookGroup.getFirstAlive().destroy();
            //this.bookGroup.getChildren()[this.bookGroup.getChildren().length - 1].destroy();
            let dek = this.bookGroup.getChildren()[0];

            this.score += dek.sign;
            this.scoreText.text = "Skor: " + this.score.toString();
            this.scoreText.x = (this.sys.game.config.width - this.scoreText.width) / 2;
            this.scoreText.y = (this.sys.game.config.height - this.scoreText.height) / 2;
            this.removeBookSound.play();

            let num = this.add.bitmapText(dek.x, dek.y, "smallfont", dek.sign.toString(), 32);
            num.setOrigin(0.5, 0.5);
            this.cameras.main.ignore(num);

            let frame = this.matter.add.sprite(dek.x, dek.y, "book_frame");
            frame.rotation = dek.rotation;
            this.cameras.main.ignore(frame);
            frame.setStatic(true);

            dek.destroy();

            //this.bookGroup.getChildren()[0].destroy();
            /* let signCount = 0;
            this.bookGroup.getChildren().forEach(function(book){
                //jika buku tersebut sudah bertumbukkan
                if(book.sign == this.maxHeightTest){
                    book.destroy();
                    this.maxHeightTest--;
                }
            }, this); */
        }
        else {
            this.removeBookSound.stop();
            // this.backgroundMusic.stop();
            this.removeEvent.remove();

            localStorage.setItem(gameOptions.localStorageName, JSON.stringify({
                score: Math.max(this.score, this.savedData.score)
            }));

            this.timerPlayAgain = this.time.addEvent({
                delay: 3000, // ms
                callback: this.playAgain,
                callbackScope: this,
                loop: false
            });
        }
    }

    playAgain() {
        this.scene.start("PlayGame");
    }
}