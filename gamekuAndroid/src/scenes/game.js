import gameOptions from "../utilities/game-options.js";
import utilities from "../utilities/android-utilities.js";

//Font Assets
import normalFont from "../assets/fonts/font.fnt";
import smallFont from "../assets/fonts/smallfont.fnt";
import normalFontImg from "../assets/fonts/font.png";
import smallFontImg from "../assets/fonts/smallfont.png";

//Image Assets
import ground from "../assets/sprites/ground.png";
import book from "../assets/sprites/book.png";
import bookFrame from "../assets/sprites/book-frame.png";

export default class PlayGame extends Phaser.Scene {
    constructor() {
        //initialize: Phaser.Scene.call(this, { key: 'PlayGame', active: false, dll... });
        super({ key: 'PlayGame', active: false });
    }

    preload() {
        //load image assets
        this.load.image("ground", ground);
        this.load.image("book", book);
        this.load.image("book_frame", bookFrame);

        //load font assets
        this.load.bitmapFont("font", normalFontImg, normalFont);
        this.load.bitmapFont("smallfont", smallFontImg, smallFont);
    }

    create() {
        // mendapatkan definisi texture
        this.GROUNDWIDTH = this.textures.get("ground").getSourceImage().width;
        this.GROUNDHEIGHT = this.textures.get("ground").getSourceImage().height;
        this.BOOKWIDTH = this.textures.get("book").getSourceImage().width;
        this.BOOKHEIGHT = this.textures.get("book").getSourceImage().height;

        this.savedData = localStorage.getItem(gameOptions.localStorageName) === null ? { score: 0 } : JSON.parse(localStorage.getItem(gameOptions.localStorageName));

        //Fixed Update time step is 30hz (0.033s), physics operations occur once every 0.033 seconds.
        /* By default, physics operations occur once every 0.02 seconds, or 50hz.
            Each FixedUpdate call is bound to the physics engine,
            and a change of the physics timescale will result in a change of the speed of the FixedUpdate. */
        this.matter.world.update30Hz();
        this.matter.world.on("collisionstart", this.checkCollision, this);
        
        this.timer = 0;
        this.score = 0;

        //membuat definisi 3 suara hit yang akan di random
        this.lastSoundPlayed = 0;
        this.hitSound = [
            utilities.playHit1,
            utilities.playHit2,
            utilities.playHit3,
        ];

        //membuat definisi timer yang trigger setiap 1 detik
        //timerEvent ini akan memanggil fungsi tick yang akan mengupdate jalannya aplikasi
        this.timerEvent = null;
        this.playOnce = true; //membatasi play remove sound satu kali saja
        this.canDrop = true; //membatasi fungsi jatuhkan buku, berkaitan dengan movingBook yanga hiden/display

        //menambahkan camera
        this.actionCamera = this.cameras.add(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        //menambahkan ground
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
        this.cameras.main.ignore(this.ground);

        //menambahkan movingBook
        //menempatkan buku di sebelah kanan dan menganimasikannya
        //menuju kearah kiri sampai ke posisi BOOKWIDTH
        this.movingBook = this.add.sprite(this.sys.game.config.width - this.BOOKWIDTH, 1.5 * this.BOOKHEIGHT, "book");
        //tween untuk menggerakkan buku
        this.tweens.add({
            targets: this.movingBook,
            x: this.BOOKWIDTH,
            duration: gameOptions.bookSpeed,
            yoyo: true,
            repeat: -1
        });
        this.cameras.main.ignore(this.movingBook);
        
        this.timeText = this.add.bitmapText(10, 10, "font", gameOptions.timeLimit.toString(), 72);
        this.actionCamera.ignore([this.timeText]);
        this.bookGroup = this.add.group();

        this.scoreText = this.add.bitmapText(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "smallfont", "Skor: 0", 32);
        this.scoreText.x = (this.sys.game.config.width - this.scoreText.width) / 2;
        this.scoreText.y = (this.sys.game.config.height - this.scoreText.height) / 2;
        this.actionCamera.ignore(this.scoreText);
        this.scoreText.visible = false;

        this.highscoreText = this.add.bitmapText(this.sys.game.config.width, 10, "smallfont", "Skor Tertinggi: " + this.savedData.score, 32);
        this.highscoreText.x = this.highscoreText.x - this.highscoreText.width - 10;
        this.actionCamera.ignore(this.highscoreText);

        this.input.on("pointerdown", this.dropBook, this);
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
                //this.addPoint = 0;
            }
        }, this);
    }

    //using _ for unused parameter
    checkCollision(_, b1, b2) {
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
        if (delay > 250 && this.timer <= gameOptions.timeLimit) {
            this.lastSoundPlayed = Date.now();
            Phaser.Math.RND.pick(this.hitSound)();
        }
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
        const zoomFactor = gameOptions.bookHeight / (this.ground.getBounds().top - this.movingBook.y);

        this.actionCamera.zoomTo(zoomFactor, 500);
        const newHeight = this.sys.game.config.height / zoomFactor;
        this.actionCamera.pan(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - (newHeight - this.sys.game.config.height) / 2, 500);
    }

    dropBook() {
        //fungsi yang di invoke saat pointerdown dan akan menjatuhkan buku ketika canDrop=true
        this.input.stopPropagation();
        if (this.canDrop && this.timer < gameOptions.timeLimit) {
            this.addTimerEvent();
            this.canDrop = false;
            this.movingBook.visible = false;
            this.addFallingBook();
        }
    }

    addTimerEvent() {
        //addTimerEvent hanya dijalankan 1 kali saja
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
        const fallingBook = this.matter.add.sprite(this.movingBook.x, this.movingBook.y, "book");
        fallingBook.setMass(2);
        fallingBook.setFrictionStatic(10);
        fallingBook.body.isBook = true;
        fallingBook.body.hit = false;
        this.bookGroup.add(fallingBook);
        this.cameras.main.ignore(fallingBook);
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
                delay: 5000,
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
            const dek = this.bookGroup.getChildren()[0];

            this.score += dek.sign;
            this.scoreText.text = "Skor: " + this.score.toString();
            this.scoreText.x = (this.sys.game.config.width - this.scoreText.width) / 2;
            this.scoreText.y = (this.sys.game.config.height - this.scoreText.height) / 2;
            //this.removeBookSound.play();

            if(!this.playOnce) {
                this.playOnce = true;
                utilities.playRemove();
            }

            const num = this.add.bitmapText(dek.x, dek.y, "smallfont", dek.sign.toString(), 32);
            num.setOrigin(0.5, 0.5);
            this.cameras.main.ignore(num);

            const frame = this.matter.add.sprite(dek.x, dek.y, "book_frame");
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
            //this.removeBookSound.stop();
            // this.backgroundMusic.stop();
            this.playOnce = false;
            utilities.removeRemove();
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
        this.scene.setActive(false, "PlayGame");
        this.scene.start("Menu");
    }
}