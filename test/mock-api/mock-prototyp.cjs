// mock data setup
let studenten = require("./mock-prototyp/studenten.json");
let referenten = require("./mock-prototyp/referenten.json");
let arbeiten = require("./mock-prototyp/arbeiten.json");

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

app.get('/api/student', (req, res) => {
    res.send(studenten);
})

app.get('/api/evaluator', (req, res) => {
    res.send(referenten);
})

app.get('/api/scientific-work', (req, res) => {
    res.send(arbeiten);
})

// express code
app.listen(port, () => {
    console.log(`Mock API running on Port ${port}`)
})
