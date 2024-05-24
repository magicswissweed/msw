plugins {
	java
	id("idea")
	id("org.springframework.boot") version "3.3.0"
	id("io.spring.dependency-management") version "1.1.5"
	id("org.flywaydb.flyway") version "9.7.0"
	id("org.openapi.generator") version "7.5.0"
}

group = "com.aa"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-jooq")
	implementation("org.flywaydb:flyway-core:9.8.2")
	implementation("org.openapitools:jackson-databind-nullable:0.2.6")

	runtimeOnly("org.postgresql:postgresql")

	testImplementation("org.springframework.boot:spring-boot-starter-test")

	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	compileOnly("io.swagger.core.v3:swagger-annotations:2.2.21")
	compileOnly("jakarta.validation:jakarta.validation-api:3.1.0")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

val generatedApiDir = "src/generated/api"
java.sourceSets["main"].java {
	srcDir(generatedApiDir)
}

flyway {
	url = "jdbc:postgresql://localhost:7010/gradlecodegen"
	user = "gradle"
	password = "password"
	locations = listOf("filesystem:" + project.rootDir + "/src/main/resources/db/migration").toTypedArray()
}

openApiGenerate {
	generatorName = "spring"
	inputSpec = "$projectDir/src/main/resources/api/mswApi.yaml"
	outputDir = "$projectDir/$generatedApiDir"
	apiPackage = "com.aa.msw.api.dto"
	modelPackage = "com.aa.msw.api.dto"

	// See https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/spring.md for all options
	configOptions = mapOf(
			"interfaceOnly" to "true",
			"useJakartaEe" to "true",
			"sourceFolder" to "", // With the default main/src/java in generated-src, the package name does not match
			"useTags" to "true"
	)
}

tasks.openApiGenerate {
	doLast {
		// OpenAPI generator generates other files, we don't need
		delete(
				"$projectDir/$generatedApiDir/.openapi-generator",
				"$projectDir/$generatedApiDir/.openapi-generator-ignore",
				"$projectDir/$generatedApiDir/pom.xml",
				"$projectDir/$generatedApiDir/README.md"
		)
	}
}

idea {
	module {
		generatedSourceDirs.add(file(generatedApiDir))
	}
}
