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
    }
    dependencies {
        classpath 'ro.isdc.wro4j.gradle:wro4j-gradle-plugin:1.8.0.Beta4'
        classpath 'org.springframework.boot:spring-boot-gradle-plugin:1.3.0.RELEASE'
    }
}

group = 'ro.isdc.wro4j.gradle'
version = '1.8.0'

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
    webjarsRuntime ("org.webjars:bootstrap:$versionBootstrap") {
        transitive = false
    }
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

## FAQ

### How should I use Bootstrap's glyph fonts?

1. Spring.Boot includes /webjars/* handler enabled by default, so use `webjarsRuntime` 
in dependencies section instead of `webjars`. In this case `bootstrap.jar` is added to 
your runtime libs and /webjars handler will be able to locate and return glyph fonts 
from `bootstrap.jar`.
 
2. If you do not use /webjars/* handler then you should copy fonts to you static 
resources and reference Bootstrap via `webjars`:
```groovy
webResources {     
    assets {
       include "webjars/bootstrap/$versionBootstrap/fonts/**"
    }
}
dependencies {
    webjars ("org.webjars:bootstrap:$versionBootstrap")
}
```
 
 3. It is also possible to use fonts from your static resources with enabled /webjars/* handler.
 ```groovy
 webResources {     
     from ("$buildMainDir/webjars/bootstrap/$versionBootstrap/fonts") {
         include '**'
         into 'themes/default/fonts'
     }
 }
 dependencies {
     webjars ("org.webjars:bootstrap:$versionBootstrap")
 }
 ```
 And override `@icon-font-path` inside `variables.less`
 ```less
 @icon-font-path:          "../../../../themes/default/fonts/";
 ```