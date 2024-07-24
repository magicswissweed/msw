FROM amazoncorretto:21
VOLUME /tmp
ADD config /config
ADD app.jar app.jar
RUN mkdir /server
ENTRYPOINT ["java", "-jar","/app.jar", "--spring.config.location=file:/config/"]
