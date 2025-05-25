// In settings.gradle you can add the repositories you want to add to the project
pluginManagement {
  repositories {
    maven(url = "https://maven.pkg.github.com/Kt-Kraft/build-logic/") {
      credentials {
        username = System.getenv("GITHUB_USERNAME")
        password = System.getenv("GITHUB_TOKEN")
      }
    }
    google()
    mavenCentral()
    gradlePluginPortal()
  }
}

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
  }
}

rootProject.name = "gameku-android"
include(":app")
