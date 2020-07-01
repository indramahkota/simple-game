package com.indramahkota.game.nyusunbuku

import android.content.Context
import android.media.MediaPlayer
import android.webkit.JavascriptInterface
import android.widget.Toast

/** Instantiate the interface and set the context  */
class WebAppInterface(private val mContext: Context) {
    private var removeSound: MediaPlayer? = null

    /** Show a toast from the web page  */
    @JavascriptInterface
    fun showToast(toast: String) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun playHit1() {
        val mediaPlayer: MediaPlayer? = MediaPlayer.create(mContext, R.raw.hit01)
        mediaPlayer?.start() // no need to call prepare(); create() does that for you
        mediaPlayer?.setOnCompletionListener {
            it.release()
        }
    }

    @JavascriptInterface
    fun playHit2() {
        val mediaPlayer: MediaPlayer? = MediaPlayer.create(mContext, R.raw.hit02)
        mediaPlayer?.start() // no need to call prepare(); create() does that for you
        mediaPlayer?.setOnCompletionListener {
            it.release()
        }
    }

    @JavascriptInterface
    fun playHit3() {
        val mediaPlayer: MediaPlayer? = MediaPlayer.create(mContext, R.raw.hit03)
        mediaPlayer?.start() // no need to call prepare(); create() does that for you
        mediaPlayer?.setOnCompletionListener {
            it.release()
        }
    }

    @JavascriptInterface
    fun playRemoveSound() {
        /*val mediaPlayer: MediaPlayer? = MediaPlayer.create(mContext, R.raw.remove)
        mediaPlayer?.start() // no need to call prepare(); create() does that for you
        mediaPlayer?.setOnCompletionListener {
            it.release()
        }*/
        if(removeSound != null) return

        removeSound = MediaPlayer.create(mContext, R.raw.remove)
        removeSound?.isLooping = true
        removeSound?.start()
    }

    @JavascriptInterface
    fun removeRemoveSound() {
        removeSound?.stop()
        removeSound?.release()
        removeSound = null
    }
}