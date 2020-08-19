package com.indramahkota.game.nyusunbuku.interfaces

import android.content.Context
import android.media.SoundPool
import android.webkit.JavascriptInterface
import android.widget.Toast
import com.indramahkota.game.nyusunbuku.R

class SoundPoolInterface(
    private val ctx: Context,
    private  var soundPool: SoundPool?
) {
    private var hit1: Int? = null
    private var hit2: Int? = null
    private var hit3: Int? = null
    private var removeSound: Int? = null

    init {
        hit1 = soundPool?.load(ctx, R.raw.hit01, 1)
        hit2 = soundPool?.load(ctx, R.raw.hit02, 1)
        hit3 = soundPool?.load(ctx, R.raw.hit03, 1)
        removeSound = soundPool?.load(ctx, R.raw.remove, 1)
    }

    @JavascriptInterface
    fun showToast(toast: String) {
        Toast.makeText(ctx, toast, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun playHit1() {
        hit1?.let { soundPool?.play(it, 1.0f, 1.0f, 1, 0, 1.0f) }
    }

    @JavascriptInterface
    fun playHit2() {
        hit2?.let { soundPool?.play(it, 1.0f, 1.0f, 1, 0, 1.0f) }
    }

    @JavascriptInterface
    fun playHit3() {
        hit3?.let { soundPool?.play(it, 1.0f, 1.0f, 1, 0, 1.0f) }
    }

    @JavascriptInterface
    fun playRemoveSound() {
        removeSound?.let { removeSound = soundPool?.play(it, 1.0f, 1.0f, 1, -1, 1.0f) }
    }

    @JavascriptInterface
    fun removeRemoveSound() {
        removeSound?.let { soundPool?.stop(it) }
        removeSound = soundPool?.load(ctx, R.raw.remove, 1)
    }
}