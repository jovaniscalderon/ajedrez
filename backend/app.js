require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    let output = '<h1>Ajedrez Backend</h1>';
    output += '<h2>Proyecto Final de Desarrollo de Software IX</h2>';
    res.send(output);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});