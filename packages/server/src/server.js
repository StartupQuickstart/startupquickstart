import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import helmet from 'helmet';

import * as passports from '@/passports';
import { loadConfig } from '@/config';
import api from '@/api';

export const server = {};

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

export const start = async () => {
  const config = await loadConfig();
  const app = new express();
  server.app = app;

  const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
  delete directives['form-action'];
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives
      }
    })
  );

  app.use(bodyParser.json({ limit: config.request.bodyLimit }));
  app.use(bodyParser.text());
  app.use(morgan(config.logging.type));

  const bodyParserOptions = { extended: true };

  app.use(bodyParser.json(bodyParserOptions));
  app.use(bodyParser.urlencoded(bodyParserOptions));

  app.use(cookieParser());

  app.use(passport.initialize());

  passports.jwt();
  passports.local();

  app.use('/assets', express.static(path.join(__dirname, '../assets')));

  await api.init(app);

  const clientPath = path.join(__dirname, '../client/build');
  if (fs.existsSync(clientPath)) {
    app.use(express.static(clientPath));

    app.get(['/', '/*'], function (req, res) {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }

  app.listen(config.server.port, () => {
    console.log(`Listening on: http://localhost:${config.server.port}`);
  });

  return app;
};

/**
 * Registers a directory with a static website
 *
 * @param {String} clientPath Path to the client
 */
export function registerClient(clientPath) {
  if (fs.existsSync(clientPath)) {
    server.app.use(express.static(clientPath));

    server.app.get(['/', '/*'], function (req, res) {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  } else {
    throw new Error(`Could not find index.html file at ${clientPath}`);
  }
}

/**
 * Registers a directory with static assets
 *
 * @param {String} route Rotue to server path at
 * @param {String} staticPath Path to static assets
 */
export function registerStatic(route, staticPath) {
  if (fs.existsSync(staticPath)) {
    route = route.startsWith('/') ? route : '/' + route;
    server.app.use(route, express.static(staticPath));
  } else {
    throw new Error(`Could not find directory at ${staticPath}`);
  }
}

server.start = start;
server.registerClient = registerClient;
server.registerStatic = registerStatic;

export default server;
