import * as express from 'express';

import * as log4js from 'log4js';

var logger = log4js.getLogger();

var app = express();

app.get('/version', (req, res) => {
  res.send({
    name: 'npmjRSS',
    tagline: 'RSS feeds for all things NPM',
    version: process.env.npm_package_version
  });
});

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.listen(3000, () => {
  logger.info('Listening on 3000');
});
