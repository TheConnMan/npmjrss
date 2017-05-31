import * as express from 'express';
import * as log4js from 'log4js';

import NpmService from './services/NpmService';

var logger = log4js.getLogger();

var app = express();

app.use(express.static('public'));

var npmService = new NpmService();

app.get('/package/:name', (req, res) => {
  npmService.getRss(req.params.name).then(rss => {
    logger.info('Got feed for ' + req.params.name);
    res.set('Content-Type', 'text/xml');
    res.send(rss);
  }).catch(e => {
    logger.error('Unable to get RSS for ' + req.params.name, e);
    res.sendStatus(500);
  });
});

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
