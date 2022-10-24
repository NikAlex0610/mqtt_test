const scene = document.getElementsByTagName('a-scene')[0]
plotAxes()

const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt')
let data = null
const boxes = []

client.subscribe('points')

function create_plain_box() {
    const box_el = document.createElement('a-box')
    box_el.setAttribute('material', {
        color: 'blue'
    });
    box_el.setAttribute('position', {
        x: 0,
        y: 0,
        z: 0
    });
    box_el.setAttribute('scale', {
        x: 0.5,
        y: 0.5,
        z: 0.5
    });
    scene.appendChild(box_el);
    return box_el
}

for (let i = 0; i < 21; i++) {
    boxes.push(create_plain_box())
}

/**
 * 
 * @param {string} msg
 */
function on_message(msg) {
    data = JSON.parse(msg)

    let i = 0

    for (const point of data) {
        const [x, y, z] = point

        boxes[i].setAttribute('position', {
            x,
            y,
            z
        })

        i++
    }
}

client.on('message', (topic, msg) => {
    on_message(msg.toString())
})

function plotAxes() {
    for (let i = 0; i < 100; i++) {
        let boxEl = document.createElement('a-sphere');
        boxEl.setAttribute('material', {
            color: 'red'
        });
        boxEl.setAttribute('position', {
            x: 0,
            y: 0,
            z: i
        });
        boxEl.setAttribute('scale', {
            x: 0.05,
            y: 0.05,
            z: 0.15
        });
        scene.appendChild(boxEl);

        let textA = document.createElement('a-text');
        textA.setAttribute('text', {
            value: 'z=' + i,
            color: 'black'
        });
        textA.setAttribute('position', {
            x: 0,
            y: 0,
            z: i
        });
        scene.appendChild(textA);



        boxEl = document.createElement('a-sphere');
        boxEl.setAttribute('material', {
            color: 'red'
        });
        boxEl.setAttribute('position', {
            x: i,
            y: 0,
            z: 0
        });
        boxEl.setAttribute('scale', {
            x: 0.05,
            y: 0.05,
            z: 0.05
        });
        scene.appendChild(boxEl);

        textA = document.createElement('a-text');
        textA.setAttribute('text', {
            value: 'x=' + i,
            color: 'black'
        });
        textA.setAttribute('position', {
            x: i,
            y: 0,
            z: 0
        });
        scene.appendChild(textA);



        boxEl = document.createElement('a-sphere');
        boxEl.setAttribute('material', {
            color: 'red'
        });
        boxEl.setAttribute('position', {
            x: 0,
            y: i,
            z: 0
        });
        boxEl.setAttribute('scale', {
            x: 0.05,
            y: 0.05,
            z: 0.05
        });
        scene.appendChild(boxEl);

        textA = document.createElement('a-text');
        textA.setAttribute('text', {
            value: 'y=' + i,
            color: 'black'
        });
        textA.setAttribute('position', {
            x: 0,
            y: i,
            z: 0
        });
        scene.appendChild(textA);
    }
}