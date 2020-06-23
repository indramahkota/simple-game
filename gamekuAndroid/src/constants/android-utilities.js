const utilities = {
    showAndroidToast(toast) {
        if (typeof Android !== "undefined" && Android !== null) {
            Android.showToast(toast);
        } else {
            alert("Not viewing in webview");
        }
    },
    showAndroidPopUp() {
        if (typeof Android !== "undefined" && Android !== null) {
            Android.showPopUp();
        } else {
            alert("Not viewing in webview");
        }
    }
}

export default utilities;