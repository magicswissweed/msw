FROM amazoncorretto:21
VOLUME /tmp
ADD config /config
ADD app.jar app.jar
RUN mkdir /server
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Xmx1024m","-jar","/app.jar", "--spring.config.location=file:/config/"]
