/* eslint-disable @typescript-eslint/no-var-requires */
// We need some way to install the built userscripts in the browser. We could
// either do WebdriverIO stuff to create a new script, enter its source, and
// save it; or we could set up a small HTTP server to serve them. We choose the
// latter as sending that much text over WebdriverIO might be a bit slow.
const { createServer } = require('http');
const fs = require('fs/promises');
const path = require('path');

const SERVER = createServer(async (req, res) => {
    console.log(req.url);
    try {
        const userscriptContent = await fs.readFile(path.resolve(`/etc/dist/${req.url ?? ''}`));
        res.setHeader('Content-Type', 'text/javascript');
        res.writeHead(200);
        res.write(userscriptContent);
        res.end();
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.write('Oops');
        res.end();
    }
});

SERVER.listen(80);
