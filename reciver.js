const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt')

client.subscribe('points')

client.on('message', (topic, msg) => {
    console.log(JSON.parse(msg.toString()))
})