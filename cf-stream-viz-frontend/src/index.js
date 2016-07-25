import request from 'request';
import path from 'path';
import express from 'express';

const port = 3000;

const TARGET_SERVER_URL = process.env.TARGET_SERVER_URL || 'http://localhost:8080';

express()
    .use(express.static(path.join(__dirname, 'static')))
    .use('/api', proxy(TARGET_SERVER_URL))
    .listen(port, () => console.log('Server started on port:', port));

function proxy(url) {
    return (req, res) => req.pipe(request(url + req.url)).pipe(res);
}
