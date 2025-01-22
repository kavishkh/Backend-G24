const express = require("express");
const fs = require("fs");
const app = express();


app.use((req, res, next) => {
    const details = {
        ipaddress: req.ip,
        time: new Date().toISOString(),
        url: req.url,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
    };

    const log = JSON.stringify(details) + "\n";

    fs.appendFile("log.txt", log, (err) => {
        if (err) {
            console.log("Error occured");
        }
        else {
            console.log("Successful");
        }

        next();;
    });


})



app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(3000, () => {
    console.log("Server running");
})