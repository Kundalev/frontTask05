const express = require('express'),
    app = express()
const { createServer } = require("http");
const httpServer = createServer(app);

var CryptoJS = require("crypto-js");


let names = []
let online = []



const host = '127.0.0.1'
const port = 3000

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', (req, res) => {
    let name = req.body.name
    let color = req.body.color
    if (names.includes(name)){
        res.send('Имя занято')
    }else {
        names.push(name)
        let ciphertext = CryptoJS.AES.encrypt(name, 'сверхсложныйключ').toString();
        let bytes  = CryptoJS.AES.decrypt(ciphertext, 'сверхсложныйключ');
        let decryptedData = (bytes.toString(CryptoJS.enc.Utf8))
        res.send({token: ciphertext, name: name, color: color})
        console.log(ciphertext)
        console.log(decryptedData)
    }
})


app.listen(port, host, () =>
    console.log(`Server listens http://${host}:${port}`)
)

let io = require('socket.io')(httpServer, {
    origins: '*:*',
    cors: {
        credentials: true
    }
});

httpServer.listen('3001');

io.on("connection", (socket) => {

    console.log('connect')
    online.push('1')
    io.sockets.emit('online', online.length.toString())


    socket.on('disconnect', () => {
        console.log('Got disconnect!');
        online.pop()
        io.emit('online', online.length.toString())
    })
    // send a message to the client
    socket.on('message', (socket) => {
        console.log(socket);
        let name = socket.name
        let message = socket.message
        let color = socket.color
        io.emit('res', {
            name: name,
            message: message,
            color: color
        })
    })
});