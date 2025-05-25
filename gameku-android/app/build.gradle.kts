plugins {
  alias(libs.plugins.convention.android.app)
  alias(libs.plugins.kotlin.android)
}

val androidApplicationId by extra { "com.indramahkota.game.nyusunbuku" }
val androidApplicationVersionCode by extra { 13 }
val androidApplicationVersionName by extra { "1.3.0" }

android {
  namespace = androidApplicationId

  defaultConfig {
    applicationId = androidApplicationId
    versionCode = androidApplicationVersionCode
    versionName = androidApplicationVersionName
  }

  buildFeatures {
    viewBinding = true
  }
}

dependencies {
  implementation(libs.androidx.webkit)
  implementation(libs.androidx.appcompat)
  implementation(libs.androidx.core.ktx)
  implementation(libs.androidx.constraintlayout)
  implementation(libs.androidx.core.ktx)

  testImplementation(libs.junit)
  androidTestImplementation(libs.androidx.junit)
  androidTestImplementation(libs.androidx.espresso.core)
}
