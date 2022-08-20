const utilities = {
  showAndroidToast(toast) {
    if (typeof Android !== "undefined") {
      Android.showToast(toast);
    }
  },
  playHit1() {
    if (typeof Android !== "undefined") {
      Android.playHit1();
    }
  },
  playHit2() {
    if (typeof Android !== "undefined") {
      Android.playHit2();
    }
  },
  playHit3() {
    if (typeof Android !== "undefined") {
      Android.playHit3();
    }
  },
  playRemove() {
    if (typeof Android !== "undefined") {
      Android.playRemoveSound();
    }
  },
  removeRemove() {
    if (typeof Android !== "undefined") {
      Android.removeRemoveSound();
    }
  },
};

export default utilities;
