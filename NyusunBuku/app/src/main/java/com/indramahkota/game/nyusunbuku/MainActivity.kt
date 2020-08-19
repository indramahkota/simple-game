package com.indramahkota.game.nyusunbuku

import android.annotation.SuppressLint
import android.media.SoundPool
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    private var soundPool: SoundPool? = null
    private var hit1: Int? = null
    private var hit2: Int? = null
    private var hit3: Int? = null
    private var removeSound: Int? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        soundPool = SoundPool.Builder()
            .setMaxStreams(3)
            .build()

        hit1 = soundPool?.load(this, R.raw.hit01, 1)
        hit2 = soundPool?.load(this, R.raw.hit02, 1)
        hit3 = soundPool?.load(this, R.raw.hit03, 1)
        removeSound = soundPool?.load(this, R.raw.remove, 1)

        soundPool?.setOnLoadCompleteListener { _, _, _ -> run {
                Log.d("AKAK", "load true")
            }
        }

        webView.setBackgroundColor(
            ContextCompat.getColor(
                applicationContext,
                R.color.colorPrimary
            )
        )

        webView.settings.javaScriptEnabled = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true
        webView.settings.domStorageEnabled = true
        webView.settings.blockNetworkImage = false
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true

        webView.webViewClient = object: WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                Handler(Looper.getMainLooper()).postDelayed({
                    splashImage.visibility = View.GONE
                    Log.d("AKAK", "visib true")
                }, 500)
                super.onPageFinished(view, url)
            }
        }

        webView.addJavascriptInterface(this, "Android")
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onPause() {
        super.onPause()
        soundPool?.autoPause()
    }

    override fun onResume() {
        super.onResume()
        soundPool?.autoResume()
    }

    override fun onBackPressed() {
        doubleBackHandler()
    }

    private var doubleBackToExitPressedOnce = false
    private fun doubleBackHandler() {
        if (doubleBackToExitPressedOnce) {
            finish()
            return
        }

        this.doubleBackToExitPressedOnce = true
        Toast.makeText(this, "Please click BACK again to exit", Toast.LENGTH_SHORT).show()
        Handler(Looper.getMainLooper()).postDelayed({ doubleBackToExitPressedOnce = false }, 2000)
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
        removeSound = soundPool?.load(this, R.raw.remove, 1)
    }
}
