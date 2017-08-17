const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const {THRESHOLD, LATITUDE, LONGTITUDE, SUBSCRIBE, USER, PASS, MQTT} = process.env

const mqtt = require('mqtt')
const geolib = require("geolib")
const client = mqtt.connect(MQTT, {
  username: USER,
  password: PASS,

})

const home = {latitude: LATITUDE, longitude: LONGTITUDE}

client.on('connect', () => client.subscribe(SUBSCRIBE))

client.on('connect', () => console.log("connected"))

client.on('error', (error) => console.error(error))

client.on('close', () => console.error("connection close"))

client.on('offline', () => console.log("offline"))

var response = {}

client.on('message', function (topic, message) {
  let payload = JSON.parse(message.toString())

  let device = topic.split("/")[2]

  response[device] = response[device] || {}
  response[device].timestamp = new Date(payload.tst * 1000)
  response[device].current = {latitude: payload.lat, longitude: payload.lon}

  let distance = geolib.getDistanceSimple(
    home,
    response[device].current
  )
  response[device].present = distance < parseInt(THRESHOLD)
  response[device].distance = {
    miles: (distance / 1000) * 0.621371,
    km: (distance / 1000),
    m: distance
  }
})

app.get('/', (req, res) => res.json(response))

app.listen(3002)