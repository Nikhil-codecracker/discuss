const http = require("http");
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);

//Client ID: 84630681315-82k0u1k1g6cjrb43qr9i3iiqhie2jkke.apps.googleusercontent.com
//Client Secret: neiDHTFRrqCaGAOQJDpBzN5w