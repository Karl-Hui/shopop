'use strict';
// Requiring app to running port
const server = require('./app');
const port = 8080;

server.listen(port, () => {
    console.log(`Server running on port:, ${port}`);
});