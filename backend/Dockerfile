FROM amazoncorretto:17
VOLUME /tmp
ADD app.jar app.jar
RUN mkdir /server
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Xmx1024m","-jar","/app.jar", "--spring.config.location=file:/server/config/"]
