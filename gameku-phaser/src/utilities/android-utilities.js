const utilities = {
  showAndroidToast(toast) {
    if (typeof AndroidSoundPool !== "undefined") {
      AndroidSoundPool.showToast(toast);
    }
  },
  playHit1() {
    if (typeof AndroidSoundPool !== "undefined") {
      AndroidSoundPool.playHit1();
    }
  },
  playHit2() {
    if (typeof AndroidSoundPool !== "undefined") {
      AndroidSoundPool.playHit2();
    }
  },
  playHit3() {
    if (typeof AndroidSoundPool !== "undefined") {
      AndroidSoundPool.playHit3();
    }
  },
  playRemove() {
    if (typeof AndroidSoundPool !== "undefined") {
      AndroidSoundPool.playRemoveSound();
    }
  },
  removeRemove() {
    if (typeof AndroidSoundPool !== "undefined") {
      AndroidSoundPool.removeRemoveSound();
    }
  }
};

export default utilities;
