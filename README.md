#locator

Microservice to determine the distance some owntracks devices are from a point (home)

`docker run -e LATITUDE=10.0 -e LONGTITUDE=0.1-e SUBSCRIBE="owntracks/#" -e USER=myuser -e PASS=mypass-e MQTT=mqtts://mymqtt:myport -p 8080:3002 pinked/locator`