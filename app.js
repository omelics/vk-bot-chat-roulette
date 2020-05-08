const express = require('express');

var app = express();

app.get('/api', function(req, res) {
    res.send(req.query);
    res.end()
});

app.listen(process.env.PORT);
