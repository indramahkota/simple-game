plugins {
  alias(indra.plugins.convention.android.app) apply false
  alias(indra.plugins.convention.android.config)
}

indramahkota {
  jvmTarget.set(JavaVersion.VERSION_11)

  android {
    minSdk.set(23)
    targetSdk.set(34)
  }
}
