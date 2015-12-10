# Wro4J Gradle Plugin Sample

Demonstrate usage of [Wro4J Gradle Plugin](https://github.com/IlyaAI/wro4j-gradle-plugin)

build.gradle
```groovy
buildscript {
    repositories {
        jcenter()
        maven { url 'http://repo.spring.io/libs-snapshot' }
        mavenLocal() // suppose plugin located in local maven repo (not published yet)
    }
    dependencies {
        classpath ('ro.isdc.wro4j.gradle:wro4j-gradle-plugin:1.7.9') { changing = true }
        classpath 'org.springframework.boot:spring-boot-gradle-plugin:1.3.0.RELEASE'
    }
}

group = 'ro.isdc.wro4j.gradle'
version = '1.7.9'

apply plugin: 'java'
apply plugin: 'wro4j'
apply plugin: 'spring-boot'

repositories {
    jcenter()
}

ext {
    versionJQuery = '2.1.4'
    versionBootstrap = '3.3.4'
}

webResources {
    bundle ('core') {
        js 'js/**.js'
        preProcessor 'jsMin'
    }
    bundle ('libs') {
        js "webjars/jquery/$versionJQuery/jquery.min.js"
    }
    bundle ('theme-default') {
        css "webjars/bootstrap/$versionBootstrap/css/bootstrap.min.css"
        css 'themes/default/main.css'
        css 'themes/default/another-stylesheet.css'

        preProcessor 'cssUrlRewriting'
    }
    assets {
        include 'themes/default/images/**'
    }
}

dependencies {
    compile 'org.springframework.boot:spring-boot-starter-web'
    webjars "org.webjars:jquery:$versionJQuery"
    webjars "org.webjars:bootstrap:$versionBootstrap"
}
```