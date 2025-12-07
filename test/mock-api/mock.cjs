const express = require('express')
const app = express()
const port = 1234

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Content-Encoding");
    next()
})

app.get('/marks/average', (req, res) => {
    res.send({marked: 7, open: 5, average: 2.3});
})

app.get('/sws/info', (req, res) => {
    res.send({count: 12, target: 2.0});
})

app.listen(port, () => {
    console.log(`Mock API running on Port ${port}`)
})
