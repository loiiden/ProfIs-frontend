// mock data setup
let students = require("./mock-data/studenten.json")
students = students.map((student) => {
    let { _id, ...rest} = student;
    return rest;
});

let referenten = require("./mock-data/referenten.json")
referenten = referenten.map((referent) => {
    let { kommentar, ...rest} = referent;
    return rest;
});

// express code
const express = require('express')
const app = express()
const port = 1234

// CORS middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Content-Encoding");
    next()
})

// add your mock data routes here
app.get('/marks/average', (req, res) => {
    res.send({marked: 7, open: 5, average: 2.3});
})

app.get('/sws/info', (req, res) => {
    res.send({count: 12, target: 2.0});
})

app.get('/student/all', (req, res) => {
    res.send(students);
})

app.get('/referent/all', (req, res) => {
    res.send(referenten);
})

// express code
app.listen(port, () => {
    console.log(`Mock API running on Port ${port}`)
})
