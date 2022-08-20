package com.indramahkota.game.nyusunbuku

import android.annotation.SuppressLint
import android.app.Activity
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
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import com.indramahkota.game.nyusunbuku.databinding.ActivityMainBinding
import com.indramahkota.game.nyusunbuku.interfaces.SoundPoolInterface

class MainActivity : Activity() {
    private var soundPool: SoundPool? = null
    private lateinit var binding: ActivityMainBinding

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.webView.setBackgroundColor(
            ContextCompat.getColor(applicationContext, R.color.colorPrimary)
        )

        binding.webView.settings.javaScriptEnabled = true
        binding.webView.settings.loadWithOverviewMode = true
        binding.webView.settings.useWideViewPort = true
        binding.webView.settings.domStorageEnabled = true
        binding.webView.settings.blockNetworkImage = false
        binding.webView.settings.allowFileAccess = true
        binding.webView.settings.allowContentAccess = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
            .build()

        binding.webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                Handler(Looper.getMainLooper()).postDelayed({
                    binding.splashImage.visibility = View.GONE
                }, 1500)
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
        binding.webView.addJavascriptInterface(
            SoundPoolInterface(this, soundPool),
            "Android"
        )
        binding.webView.loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
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
