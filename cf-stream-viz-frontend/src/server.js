import path from 'path';
import express from 'express';

const port = 3000;

express()
    .use(express.static(path.join(__dirname, 'static')))
    .listen(port, () => console.log('Server started on port:', port));
