const http = require("http");
const express = require("express");
const app = require("./app.js");

const normalizePort = val => 
{
    const port = parseInt(val, 10);
    if(isNaN(port))
        return val;
    if(port >= 0)
        return port;
    return false;
}

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = error => 
{
    if(error.syscall !== "listen")
        throw error;
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr: "port" + port;
    switch(error.code)
    {
        case "EACCES":
            console.error(`${bind} haut privilege requis`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => 
{
    const address = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr: "port" + port;

});
server.listen(port);
console.log(`server is ready ! on port ${port}`);