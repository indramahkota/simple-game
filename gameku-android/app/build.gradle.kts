import com.indramahkota.gradle.common.utils.loadPropertiesFile

plugins {
  alias(indra.plugins.convention.android.app)
  alias(libs.plugins.secret.gradle.plugin)
}

val androidApplicationId by extra { "com.indramahkota.game.nyusunbuku" }
val androidApplicationVersionCode by extra { 1 }
val androidApplicationVersionName by extra { "0.0.0" }
val secretPropertiesFile by extra { "../secrets.properties" }

android {
  namespace = androidApplicationId

  defaultConfig {
    applicationId = androidApplicationId
    versionCode = androidApplicationVersionCode
    versionName = androidApplicationVersionName
  }

  signingConfigs {
    create("release") {
      val propertiesFile = loadPropertiesFile(secretPropertiesFile)
      keyAlias = propertiesFile.getProperty("KEY_ALIAS")
      keyPassword = propertiesFile.getProperty("KEY_PASSWORD")
      storeFile = file(propertiesFile.getProperty("STORE_FILE"))
      storePassword = propertiesFile.getProperty("STORE_PASSWORD")
    }
  }

  buildTypes {
    release {
      signingConfig = signingConfigs.getByName("release")
    }
  }

  buildFeatures {
    viewBinding = true
  }
}

secrets {
  propertiesFileName = "secrets.properties"
  defaultPropertiesFileName = "secrets.defaults.properties"
}

dependencies {
  implementation("androidx.webkit:webkit:1.7.0")
  implementation("androidx.appcompat:appcompat:1.6.1")
  implementation("androidx.core:core-ktx:1.10.1")
  implementation("androidx.constraintlayout:constraintlayout:2.1.4")

  testImplementation("junit:junit:4.13.2")
  androidTestImplementation("androidx.test.ext:junit:1.1.5")
  androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
