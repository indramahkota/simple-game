package com.indramahkota.game.nyusunbuku

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
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import com.indramahkota.game.nyusunbuku.databinding.ActivityMainBinding
import com.indramahkota.game.nyusunbuku.interfaces.SoundPoolInterface

class MainActivity : AppCompatActivity() {

  private var soundPool: SoundPool? = null
  private lateinit var binding: ActivityMainBinding

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)

    onBackPressedDispatcher.addCallback(this,
      object : OnBackPressedCallback(true) {
        override fun handleOnBackPressed() {
          doubleBackHandler()
        }
      }
    )

    val assetLoader = WebViewAssetLoader.Builder()
      .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
      .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
      .build()

    soundPool = SoundPool.Builder().setMaxStreams(1).build()

    with(binding.webView) {
      setBackgroundColor(ContextCompat.getColor(applicationContext, R.color.colorPrimary))
      with(settings) {
        javaScriptEnabled = true
        loadWithOverviewMode = true
        useWideViewPort = true
        domStorageEnabled = true
        blockNetworkImage = false
        allowFileAccess = true
        allowContentAccess = true
      }
      webViewClient = object : WebViewClient() {
        override fun onPageFinished(view: WebView?, url: String?) {
          Handler(Looper.getMainLooper()).postDelayed({
            binding.splashImage.visibility = View.GONE
          }, LOAD_DELAY)
          super.onPageFinished(view, url)
        }

        override fun shouldInterceptRequest(
          view: WebView,
          request: WebResourceRequest
        ): WebResourceResponse? {
          return assetLoader.shouldInterceptRequest(request.url)
        }
      }
      addJavascriptInterface(
        SoundPoolInterface(this@MainActivity, soundPool), "Android"
      )
      loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
    }
  }

  override fun onPause() {
    super.onPause()
    soundPool?.autoPause()
  }

  override fun onResume() {
    super.onResume()
    soundPool?.autoResume()
  }

  private var doubleBackToExitPressedOnce = false
  private fun doubleBackHandler() {
    if (doubleBackToExitPressedOnce) {
      finish()
      return
    }
    this.doubleBackToExitPressedOnce = true
    Toast.makeText(this, getString(R.string.please_click_back_again_to_exit), Toast.LENGTH_SHORT)
      .show()
    Handler(
      Looper.getMainLooper()
    ).postDelayed(
      { doubleBackToExitPressedOnce = false },
      BACK_PRESS_DELAY
    )
  }

  companion object {
    private const val LOAD_DELAY = 1500L
    private const val BACK_PRESS_DELAY = 2000L
  }
}
