# Wro4J Gradle Plugin Sample

This sample demonstrates:
 * usage of [Wro4J Gradle Plugin](https://github.com/IlyaAI/wro4j-gradle-plugin) with [Spring Boot](http://projects.spring.io/spring-boot)
 * continuous build of web resources
 * [Jasmine](http://jasmine.github.io) tests (via Gradle Node plugin)

## Wro4J Gradle Plugin
```groovy
buildscript {
    repositories {
        jcenter()
        maven { url 'http://repo.spring.io/libs-snapshot' }
        maven { url 'https://dl.bintray.com/ilyaai/maven' }
    }
    dependencies {
        classpath 'ro.isdc.wro4j.gradle:wro4j-gradle-plugin:1.7.9.Beta2'
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

## Continuous Build

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

## Jasmine Tests

Add the following lines in your build.gradle:

```groovy
buildscript {
    dependencies {
        classpath 'com.moowork.gradle:gradle-node-plugin:0.11'
    }
}

apply plugin: 'com.moowork.node'

node {
    download = true
}

ext {
    versionJasmine = '2.3.4'
}

webResources {
    testAssets {
        from (srcTestDir) {
            exclude '*SpecRunner.html'
            exclude '*.conf.js'
        }

        from (srcTestDir) {
            include '*SpecRunner.html'
            include '*.conf.js'

            expand([
                'srcMain': buildMainUri,
                'srcTest': buildTestUri,
                'webjarJasmine': "$buildTestUri/webjars/jasmine/$versionJasmine"
            ])
        }
    }
}

dependencies {
    webjarsTest "org.webjars.bower:jasmine:$versionJasmine"
}

task cleanNodeModules(type: Delete)  {
    delete file('node_modules')
}

task installJasmine(type: NpmTask) {
    outputs.dir file('node_modules')

    npmCommand = ['install']
    args += ['karma', 'karma-jasmine@2_0', 'karma-phantomjs-launcher']
}

task runJasmine(type: NodeTask, dependsOn: [installJasmine, processWebTestResources]) {
    script = file('node_modules/karma/bin/karma')
    args = ['start', "${webResources.buildTestDir}/karma.conf.js"]
}

test.dependsOn runJasmine
```

Now `gradlew test` command runs Jasmine tests along with regular Java tests.