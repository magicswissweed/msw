FROM amazoncorretto:21
VOLUME /tmp
ADD app.jar app.jar
RUN mkdir /server
ENTRYPOINT ["java", "-jar","/app.jar"]
