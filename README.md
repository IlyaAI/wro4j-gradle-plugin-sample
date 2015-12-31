# Wro4J Gradle Plugin Sample

Demonstrate usage of [Wro4J Gradle Plugin](https://github.com/IlyaAI/wro4j-gradle-plugin)

### build.gradle
```groovy
buildscript {
    repositories {
        jcenter()
        maven { url 'http://repo.spring.io/libs-snapshot' }
        maven { url 'https://dl.bintray.com/ilyaai/maven' }
    }
    dependencies {
        classpath 'ro.isdc.wro4j.gradle:wro4j-gradle-plugin:1.7.9-Beta2'
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
        js 'js/**/*.js'
        preProcessor 'jsMin'
    }
    bundle ('libs') {
        js "webjars/jquery/$versionJQuery/jquery.min.js"
    }
    bundle ('theme-default') {
        css "webjars/bootstrap/$versionBootstrap/less/bootstrap.less"
        css 'themes/default/main.css'

        cssOverrideImport 'variables.less', '../../../../themes/default/variables.less'
        preProcessor 'less4j'
        cssRewriteUrl()
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

### Continuous Build

Run the following commands (in separate consoles):
```
gradlew bootRun
```
and
```
gradlew processWebResources -t
```
Now when you edit your web resources Gradle will re-process them on the fly.
You only need to refresh your page in a browser to see changes.