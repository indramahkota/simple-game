package com.indramahkota.game.nyusunbuku

import android.annotation.SuppressLint
import android.media.SoundPool
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import androidx.webkit.WebViewAssetLoader.ResourcesPathHandler
import com.indramahkota.game.nyusunbuku.interfaces.SoundPoolInterface
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    private var soundPool: SoundPool? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView.setBackgroundColor(
            ContextCompat.getColor(applicationContext, R.color.colorPrimary)
        )

        webView.settings.javaScriptEnabled = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true
        webView.settings.domStorageEnabled = true
        webView.settings.blockNetworkImage = false
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", AssetsPathHandler(this))
            .addPathHandler("/res/", ResourcesPathHandler(this))
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                Handler(Looper.getMainLooper()).postDelayed({
                    splashImage.visibility = View.GONE
                }, 500)
                super.onPageFinished(view, url)
            }

            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }
        }

        soundPool = SoundPool.Builder().setMaxStreams(1).build()
        webView.addJavascriptInterface(SoundPoolInterface(this, soundPool), "AndroidSoundPool")
        webView.loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
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
}
